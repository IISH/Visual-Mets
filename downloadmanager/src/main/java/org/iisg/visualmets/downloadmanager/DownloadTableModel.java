package org.iisg.visualmets.downloadmanager;

import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.table.AbstractTableModel;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Observable;
import java.util.Observer;

// This class manages the download table's data.
class DownloadsTableModel extends AbstractTableModel
        implements Observer {

    // These are the names for the table's columns.
    private static final String[] columnNames = {"Preview", "URL", "Size", "Progress", "Status"};

    // These are the classes for each column's values.
    private static final Class[] columnClasses = {ImageIcon.class, String.class,
            String.class, JProgressBar.class, String.class};

    // The table's list of downloads.
    private ArrayList<Download> downloadList = new ArrayList<Download>();

    // Add a new download to the table.
    public void addDownload(Download download) {

        // Register to be notified when the download changes.
        download.addObserver(this);

        downloadList.add(download);

        // Fire table row insertion notification to table.
        fireTableRowsInserted(getRowCount() - 1, getRowCount() - 1);
    }

    // Get a download for the specified row.
    public Download getDownload(int row) {
        return downloadList.get(row);
    }

    // Remove a download from the list.
    public void clearDownload(int row) {
        downloadList.remove(row);

        // Fire table row deletion notification to table.
        fireTableRowsDeleted(row, row);
    }

    // Get table's column count.
    public int getColumnCount() {
        return columnNames.length;
    }

    // Get a column's name.
    public String getColumnName(int col) {
        return columnNames[col];
    }

    // Get a column's class.
    public Class getColumnClass(int col) {
        return columnClasses[col];
    }

    // Get table's row count.
    public int getRowCount() {
        return downloadList.size();
    }

    // Get value for a specific row and column combination.
    public Object getValueAt(int row, int col) {

        Download download = downloadList.get(row);
        switch (col) {
            case 10: // Icon. We expect the preview image to be in the parent folder/preview/[filename.pmg]
                if (download.getFilename() == null) return "";
                int i = download.getFilename().getName().indexOf(".");
                String filename = (i == -1) ? download.getFilename().getName() : download.getFilename().getName().substring(0, i);
                File preview = new File(download.getFilename().getParentFile().getParentFile(), "preview/" + filename + ".png");
                if (preview.exists()) {
                    return new ImageIcon(preview.getAbsolutePath());
                } else if (download.getStatus() == Download.COMPLETE) {
                    if (!preview.getParentFile().exists()) preview.getParentFile().mkdirs();
                    try {
                        final Image scaledInstance = ImageIO.read(download.getFilename()).getScaledInstance(-1, 105, Image.SCALE_SMOOTH);
                        final BufferedImage bufferedImage = new BufferedImage(scaledInstance.getWidth(null), scaledInstance.getHeight(null), BufferedImage.TYPE_INT_RGB);
                        bufferedImage.getGraphics().drawImage(scaledInstance, 0, 0, null);
                        ImageIO.write(bufferedImage, "png", preview);
                        return new ImageIcon(bufferedImage);
                    } catch (IOException e) {
                        return "";
                    }
                }
            case 1: // URL
                return download.getUrl();
            case 2: // Size
                long size = download.getSize();
                return (size == -1) ? "" : Long.toString(size);
            case 3: // Progress
                return download.getProgress();
            case 4: // Status
                return Download.STATUSES[download.getStatus()];
        }
        return "";
    }

    /* Update is called when a Download notifies its
observers of any changes */
    public void update(Observable o, Object arg) {
        int index = downloadList.indexOf(o);
        // Fire table row update notification to table.
        fireTableRowsUpdated(index, index);
    }

}