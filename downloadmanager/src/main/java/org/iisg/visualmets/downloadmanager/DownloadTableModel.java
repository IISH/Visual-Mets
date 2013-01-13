package org.iisg.visualmets.downloadmanager;

import javax.swing.*;
import javax.swing.table.AbstractTableModel;
import java.awt.*;
import java.util.ArrayList;
import java.util.Observable;
import java.util.Observer;

// This class manages the download table's data.
class DownloadsTableModel extends AbstractTableModel
        implements Observer {

    // These are the names for the table's columns.
    private static final String[] columnNames = {"Preview", "Select", "URL", "Size", "Progress", "Status"};

    // These are the classes for each column's values.
    private static final Class[] columnClasses = {ImageIcon.class, Checkbox.class, String.class,
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
            case 0: // Icon
                if (download.getStatus() == Download.COMPLETE)
                    return new ImageIcon((new ImageIcon(download.getFilename().getAbsolutePath())).getImage().getScaledInstance(-1, 105, Image.SCALE_SMOOTH));
            case 1: // Select
                return new JCheckBox("", download.isChecked());
            case 2: // URL
                return download.getUrl();
            case 3: // Size
                long size = download.getSize();
                return (size == -1) ? "" : Long.toString(size);
            case 4: // Progress
                return download.getProgress();
            case 5: // Status
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