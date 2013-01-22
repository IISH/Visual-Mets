package org.iisg.visualmets.downloadmanager;

import au.edu.apsr.mtk.base.METS;
import au.edu.apsr.mtk.base.METSException;

import javax.swing.*;
import javax.swing.event.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.*;

/**
 * FormPreview
 */
public class FormPreview implements Observer {
    private JTable table1;
    private JPanel panel1;
    private JTextField textField1;
    private JTextField downloadFolder;
    private JPanel buttonsPanel;
    private JButton pauseSelectedButton;
    private JButton resumeSelectedButton;
    private JButton cancelSelectedButton;
    private JButton clearSelectedButton;
    private JButton selectButton;
    private JComboBox grpUse;
    private JButton loadMetsButton;
    private JButton pauseGroupButton;
    private JButton resumeGroupButton;
    private JButton cancelGroupButton;
    private JButton clearGroupButton;
    private JProgressBar progressBar1;

    private DownloadsTableModel tableModel;

    final MetsService metsService = new MetsService();
    METS mets;

    File metsFile;

    // Currently selected download.
    private Download selectedDownload;

    // Flag for whether or not table selection is being cleared.
    private boolean clearing;
    private Properties headers;

    public FormPreview(Properties headers, String metsId) {

        this.headers = headers;

        tableModel = new DownloadsTableModel(progressBar1);
        table1.setModel(tableModel);
        pauseSelectedButton.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                actionSelectedPause();
            }
        });
        resumeSelectedButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                actionSelectedResume();
            }
        });
        cancelSelectedButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                actionSelectedCancel();
            }
        });
        clearSelectedButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                actionSelectedClear();
            }
        });
        selectButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                actionFolderSelect();
            }
        });

        // Allow only one row at a time to be selected.
        table1.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);

        // Set up ProgressBar as renderer for progress column.
        ProgressRenderer renderer = new ProgressRenderer(0, 100);
        renderer.setStringPainted(true); // show progress text
        table1.setDefaultRenderer(JProgressBar.class, renderer);


        // Set table's row height large enough to fit JProgressBar.
        int dim = 105;
        table1.setRowHeight(dim);
        table1.getColumnModel().getColumn(0).setMinWidth(dim);
        table1.getColumnModel().getColumn(0).setMaxWidth(dim);
        table1.getColumnModel().getColumn(0).setCellRenderer(new ImageRenderer());

        table1.getSelectionModel().addListSelectionListener(new
                                                            ListSelectionListener() {
                                                                public void valueChanged(ListSelectionEvent e) {
                                                                    tableSelectionChanged();
                                                                }
                                                            });

        grpUse.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                if (grpUse.isEnabled()) downloadFileGrp((String) grpUse.getSelectedItem());
            }
        });

        textField1.setText(metsId);
        downloadFolder.setText(System.getProperty("user.home", ".") + File.separator + "visualmets");
        loadMetsButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                actionLoadMets();
            }
        });
        resumeGroupButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                actionGroupResume();
            }
        });
        clearGroupButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                actionGroupClear(false);
            }
        });
        pauseGroupButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                actionGroupPause();
            }
        });
        cancelGroupButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                actionGroupCancel();
            }
        });
    }


    private void actionLoadMets() {
        if (verifyUrl(textField1.getText())) {
            actionGroupCancel();
            try {
                final Download download = new Download(textField1.getText(), null, downloadFolder.getText(), Download.DOWNLOADING, null, headers);
                download.addObserver(this);
                tableModel.addDownload(download);
            } catch (MalformedURLException ee) {
                error(ee.getMessage());
            }
        } else {
            error("Invalid Download URL");
        }
    }


    private void actionFolderSelect() {
        JFileChooser chooser = new JFileChooser();
        chooser.setCurrentDirectory(new java.io.File(downloadFolder.getText()));
        chooser.setDialogTitle("select folder");
        chooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
        chooser.setAcceptAllFileFilterUsed(false);
        final int result = chooser.showDialog(this.panel1, "Ok");
        if (result == 0) downloadFolder.setText(chooser.getSelectedFile().getAbsolutePath());
    }

    private void downloadFileGrp(String use) {

        if (mets == null) return;
        actionGroupClear(true);

        List<String> uses;
        try {
            uses = metsService.getFileGrpUseTypes(mets);
        } catch (METSException e) {
            error(e.getMessage());
            return;
        }

        if (grpUse.getItemCount() == 0) {
            grpUse.setEnabled(false);
            for (String _use : uses) {
                grpUse.addItem(_use);
            }
        }

        if (uses.contains(use)) {
            Map<Integer, String[]> urls;
            try {
                urls = metsService.getURLs(mets, use, headers.size()==0);
            } catch (METSException e) {
                error(e.getMessage());
                return;
            }

            for (Integer order : urls.keySet()) {
                String[] hrefLabel = urls.get(order);
                try {
                    tableModel.addDownload(new Download(hrefLabel[0], hrefLabel[1], downloadFolder.getText() + "/" +
                            metsFile.getName().substring(0, metsFile.getName().length() - 4) + "/" +
                            use, Download.PENDING, String.format("%05d", order), headers));
                } catch (MalformedURLException e) {
                    e.printStackTrace();
                }
            }
        }

        grpUse.setSelectedItem(use);
        grpUse.setEnabled(true);

        tableModel.setStatus(Download.PENDING);
        updateGroupButtons();
    }

    private void error(String msg) {
        JOptionPane.showMessageDialog(panel1,
                msg, "Error",
                JOptionPane.ERROR_MESSAGE);
    }

    // Verify download URL.
    private boolean verifyUrl(String url) {
        // Only allow HTTP URLs.
        if (!(url.toLowerCase().startsWith("http://") || url.toLowerCase().startsWith("https://")))
            return false;

        // Verify format of URL.
        try {
            new URL(url);
        } catch (Exception e) {
            return false;
        }

        return true;
    }

    // Called when table row selection changes.
    private void tableSelectionChanged() {
        /* Unregister from receiving notifications
   from the last selected download. */
        if (selectedDownload != null)
            selectedDownload.deleteObserver(FormPreview.this);

        /* If not in the middle of clearing a download,
    set the selected download and register to
    receive notifications from it. */
        if (!clearing) {
            final int selectedRow = table1.getSelectedRow();
            if (selectedRow != -1) {
                selectedDownload =
                        tableModel.getDownload(selectedRow);
                selectedDownload.addObserver(FormPreview.this);
            }
            updateSelectedButtonsAndMenu();
        }
    }

    private void actionGroupClear(boolean all) {
        clearing = true;
        tableModel.clear(all);
        clearing = false;
        updateGroupButtons();
    }

    private void actionGroupCancel() {
        clearing = true;
        tableModel.cancel();
        clearing = false;
        updateGroupButtons();
    }

    private void actionGroupPause() {
        tableModel.pause();
        updateGroupButtons();
    }

    private void actionGroupResume() {
        tableModel.resume();
        updateGroupButtons();
    }

    private void actionSelectedPause() {
        selectedDownload.pause();
        updateSelectedButtonsAndMenu();
    }

    // Resume the selected download.
    private void actionSelectedResume() {
        selectedDownload.resume();
        updateSelectedButtonsAndMenu();
    }

    // Cancel the selected download.
    private void actionSelectedCancel() {
        selectedDownload.cancel();
        updateSelectedButtonsAndMenu();
    }

    // Clear the selected download.
    private void actionSelectedClear() {
        clearing = true;
        tableModel.clearDownload(table1.getSelectedRow());
        clearing = false;
        selectedDownload = null;
        updateSelectedButtonsAndMenu();
    }

    /* Update each button's state based off of the
currently selected download's status. */
    private void updateSelectedButtonsAndMenu() {
        if (selectedDownload != null) {
            int status = selectedDownload.getStatus();
            switch (status) {
                case Download.DOWNLOADING:
                    pauseSelectedButton.setEnabled(true);
                    resumeSelectedButton.setEnabled(false);
                    cancelSelectedButton.setEnabled(true);
                    clearSelectedButton.setEnabled(false);
                    break;
                case Download.PAUSED:
                    pauseSelectedButton.setEnabled(false);
                    resumeSelectedButton.setEnabled(true);
                    cancelSelectedButton.setEnabled(true);
                    clearSelectedButton.setEnabled(false);
                    break;
                case Download.PENDING:
                    pauseSelectedButton.setEnabled(false);
                    resumeSelectedButton.setEnabled(true);
                    cancelSelectedButton.setEnabled(false);
                    clearSelectedButton.setEnabled(false);
                    break;
                case Download.ERROR:
                    pauseSelectedButton.setEnabled(false);
                    resumeSelectedButton.setEnabled(true);
                    cancelSelectedButton.setEnabled(false);
                    clearSelectedButton.setEnabled(true);
                    break;
                default: // COMPLETE or CANCELLED
                    pauseSelectedButton.setEnabled(false);
                    resumeSelectedButton.setEnabled(false);
                    cancelSelectedButton.setEnabled(false);
                    clearSelectedButton.setEnabled(true);
            }
            resumeSelectedButton.setText(status == Download.PENDING ? "Start" : "Resume");
        } else {
            // No download is selected in table.
            pauseSelectedButton.setEnabled(false);
            resumeSelectedButton.setEnabled(false);
            cancelSelectedButton.setEnabled(false);
            clearSelectedButton.setEnabled(false);
        }

    }

    private void updateGroupButtons() {
        final int status = tableModel.getStatus();
        switch (status) {
            case Download.PENDING:
                pauseGroupButton.setEnabled(false);
                resumeGroupButton.setEnabled(true);
                cancelGroupButton.setEnabled(false);
                clearGroupButton.setEnabled(false);

                break;
            case Download.DOWNLOADING:
                pauseGroupButton.setEnabled(true);
                resumeGroupButton.setEnabled(false);
                cancelGroupButton.setEnabled(true);
                clearGroupButton.setEnabled(true);
                break;
            case Download.PAUSED:
                pauseGroupButton.setEnabled(false);
                resumeGroupButton.setEnabled(true);
                cancelGroupButton.setEnabled(true);
                clearGroupButton.setEnabled(true);
                break;
            case Download.COMPLETE:
                pauseGroupButton.setEnabled(false);
                resumeGroupButton.setEnabled(false);
                cancelGroupButton.setEnabled(false);
                clearGroupButton.setEnabled(true);
                break;
            case Download.CANCELLED:
                pauseGroupButton.setEnabled(false);
                resumeGroupButton.setEnabled(false);
                cancelGroupButton.setEnabled(false);
                clearGroupButton.setEnabled(false);
                break;
        }
        resumeGroupButton.setText(status == Download.PENDING ? "Start" : "Resume");
    }

    /* Update is called when a Download notifies its
observers of any changes. */
    public void update(Observable o, Object arg) {
        // Update buttons if the selected download has changed.
        final Download download = (Download) o;
        if (selectedDownload != null && selectedDownload.equals(download)) {
            updateSelectedButtonsAndMenu();
        } else if (download.getStatus() == Download.COMPLETE || download.getStatus() == Download.SKIPPED) {
            try {
                mets = metsService.load(download.getFilename());
                metsFile = download.getFilename();
            } catch (Exception e) {
                error(e.getMessage());
            }
            downloadFileGrp(MetsService.USE_THUMBNAIL_IMAGE);
        }
    }

    public Container getMainPanel() {
        return panel1;
    }
}
