package org.iisg.visualmets.downloadmanager;

import au.edu.apsr.mtk.base.METS;
import au.edu.apsr.mtk.base.METSException;

import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.TableCellRenderer;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
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
    private JButton goButton;
    private JTextField downloadFolder;
    private JPanel buttonsPanel;
    private JButton pauseButton;
    private JButton resumeButton;
    private JButton cancelButton;
    private JButton clearButton;
    private JButton selectButton;
    private JComboBox grpUse;
    private JButton downloadButton;

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
        goButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                if (verifyUrl(textField1.getText())) {
                    clearDownloads();
                    try {
                        final Download download = new Download(textField1.getText(), downloadFolder.getText(), Download.DOWNLOADING, null, self().headers);
                        download.addObserver(self());
                        tableModel.addDownload(download);
                    } catch (MalformedURLException ee) {
                        error(ee.getMessage());
                    }
                } else {
                    error("Invalid Download URL");
                }
            }
        });

        tableModel = new DownloadsTableModel();
        table1.setModel(tableModel);
        pauseButton.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                actionPause();
            }
        });
        resumeButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                actionResume();
            }
        });
        cancelButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                actionCancel();
            }
        });
        clearButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                actionClear();
            }
        });
        selectButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                actionFolderSelect();
            }
        });
        downloadButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                downloadFileGrp((String) grpUse.getSelectedItem(), Download.PAUSED);
            }
        });
        // Allow only one row at a time to be selected.
        table1.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);

        // Set up ProgressBar as renderer for progress column.
        ProgressRenderer renderer = new ProgressRenderer(0, 100);
        renderer.setStringPainted(true); // show progress text
        table1.setDefaultRenderer(JProgressBar.class, renderer);

        // Set table's row height large enough to fit JProgressBar.
        table1.setRowHeight(105);
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
                if (grpUse.isEnabled()) downloadFileGrp((String) grpUse.getSelectedItem(), Download.PAUSED);
            }
        });

        textField1.setText(metsId);
    }

    private void clearDownloads() {
        clearing = true;
        while (tableModel.getRowCount() != 0) {
            tableModel.clearDownload(0);
        }
        clearing = false;
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

    private void downloadFileGrp(String use, int status) {

        if (mets == null) return;

        List<String> uses;
        try {
            uses = metsService.getFileGrpUseTypes(mets);
        } catch (METSException e) {
            error(e.getMessage());
            return;
        }

        grpUse.setEnabled(false);
        grpUse.removeAllItems();
        for (String _use : uses) {
            grpUse.addItem(_use);
        }

        if (uses.contains(use)) {
            Map<Integer, String> urls;
            try {
                urls = metsService.getURLs(mets, use);
            } catch (METSException e) {
                error(e.getMessage());
                return;
            }

            clearDownloads();

            for (Integer order : urls.keySet()) {
                String href = urls.get(order);
                try {
                    tableModel.addDownload(new Download(href, downloadFolder.getText() + "/" +
                            metsFile.getName().substring(0, metsFile.getName().length() - 4) + "/" +
                            use, status, String.format("%05d", order), self().headers));
                } catch (MalformedURLException e) {
                    e.printStackTrace();
                }
            }
        }

        // Kickstart the first download
        if (tableModel.getRowCount() != 0) tableModel.getDownload(0).resume();

        grpUse.setSelectedItem(use);
        grpUse.setEnabled(true);
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
            updateButtons();
        }
    }

    // Pause the selected download.
    private void actionPause() {
        selectedDownload.pause();
        updateButtons();
    }

    // Resume the selected download.
    private void actionResume() {
        selectedDownload.resume();
        updateButtons();
    }

    // Cancel the selected download.
    private void actionCancel() {
        selectedDownload.cancel();
        updateButtons();
    }

    // Clear the selected download.
    private void actionClear() {
        clearing = true;
        tableModel.clearDownload(table1.getSelectedRow());
        clearing = false;
        selectedDownload = null;
        updateButtons();
    }

    /* Update each button's state based off of the
currently selected download's status. */
    private void updateButtons() {
        if (selectedDownload != null) {
            int status = selectedDownload.getStatus();
            switch (status) {
                case Download.DOWNLOADING:
                    pauseButton.setEnabled(true);
                    resumeButton.setEnabled(false);
                    cancelButton.setEnabled(true);
                    clearButton.setEnabled(false);
                    break;
                case Download.PAUSED:
                    pauseButton.setEnabled(false);
                    resumeButton.setEnabled(true);
                    cancelButton.setEnabled(true);
                    clearButton.setEnabled(false);
                    break;
                case Download.ERROR:
                    pauseButton.setEnabled(false);
                    resumeButton.setEnabled(true);
                    cancelButton.setEnabled(false);
                    clearButton.setEnabled(true);
                    break;
                default: // COMPLETE or CANCELLED
                    pauseButton.setEnabled(false);
                    resumeButton.setEnabled(false);
                    cancelButton.setEnabled(false);
                    clearButton.setEnabled(true);
            }
        } else {
            // No download is selected in table.
            pauseButton.setEnabled(false);
            resumeButton.setEnabled(false);
            cancelButton.setEnabled(false);
            clearButton.setEnabled(false);
        }
    }

    /* Update is called when a Download notifies its
observers of any changes. */
    public void update(Observable o, Object arg) {
        // Update buttons if the selected download has changed.
        final Download download = (Download) o;
        if (selectedDownload != null && selectedDownload.equals(download)) {
            updateButtons();
        } else if (download.getStatus() == Download.COMPLETE) {
            try {
                mets = metsService.load(download.getFilename());
                metsFile = download.getFilename();
            } catch (Exception e) {
                error(e.getMessage());
            }
            downloadFileGrp(MetsService.USE_THUMBNAIL_IMAGE, Download.PAUSED);
        }
    }

    private FormPreview self() {
        return this;
    }

    public Container getMainPanel() {
        return panel1;
    }

    private class ImageRenderer implements TableCellRenderer {
        @Override
        public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {

            JLabel label = new JLabel();
            Download download = tableModel.getDownload(row);
            if (value != null && value instanceof String && ((String) value).length() != 0) {
                if (download.getFilename() == null) return null;
                int i = download.getFilename().getName().indexOf(".");
                String filename = (i == -1) ? download.getFilename().getName() : download.getFilename().getName().substring(0, i);
                File preview = new File(download.getFilename().getParentFile().getParentFile(), "preview/" + filename + ".png");
                if (preview.exists()) {
                    label.setIcon(new ImageIcon(preview.getAbsolutePath()));
                } else if (download.getStatus() == Download.COMPLETE) {
                    if (!preview.getParentFile().exists()) preview.getParentFile().mkdirs();
                    try {
                        final Image scaledInstance = ImageIO.read(download.getFilename()).getScaledInstance(-1, 105, Image.SCALE_SMOOTH);
                        final BufferedImage bufferedImage = new BufferedImage(scaledInstance.getWidth(null), scaledInstance.getHeight(null), BufferedImage.TYPE_INT_RGB);
                        bufferedImage.getGraphics().drawImage(scaledInstance, 0, 0, null);
                        ImageIO.write(bufferedImage, "png", preview);
                        label.setIcon(new ImageIcon(bufferedImage));
                    } catch (IOException e) {
                    }
                }
            }
            return label;
        }
    }


}
