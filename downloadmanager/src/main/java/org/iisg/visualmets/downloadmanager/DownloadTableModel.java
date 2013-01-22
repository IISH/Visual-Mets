package org.iisg.visualmets.downloadmanager;

import javax.swing.*;
import javax.swing.table.AbstractTableModel;
import java.util.ArrayList;
import java.util.Observable;
import java.util.Observer;

// This class manages the download table's data.
class DownloadsTableModel extends AbstractTableModel
        implements Observer {

    // These are the names for the table's columns.
    private static final String[] columnNames = {"Preview", "Label", "URL", "Size", "Progress", "Status"};

    // These are the classes for each column's values.
    private static final Class[] columnClasses = {JLabel.class, String.class, String.class,
            String.class, JProgressBar.class, String.class};

    // The table's list of downloads.
    private ArrayList<Download> downloadList = new ArrayList<Download>();

    private int progress;
    private JProgressBar progressBar1;

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    private int status;

    public DownloadsTableModel(JProgressBar progressBar1) {
        this.progressBar1 = progressBar1;  // not sure how to have a listener
    }


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
            case 0: // Handled by a separate thread.
                break;
            case 1: // page label
                return download.getLabel();
            case 2: // URL
                return download.getUrl();
            case 3: // Size
                long size = download.getSize();
                return (size == -1) ? "" : Long.toString(size);
            case 4: // Progress
                return download.getProgress();
            case 5: // Status
                if (download.getStatus() == Download.ERROR) {
                    return download.getErrorMessage();
                } else
                    return Download.STATUSES[download.getStatus()];
        }
        return "";
    }

    /*
    Update is called when a Download notifies its observers of any changes
*/
    public void update(Observable o, Object arg) {
        final Download download = (Download) o;
        int index = downloadList.indexOf(download);
        // Fire table row update notification to table.
        fireTableRowsUpdated(index, index);

        progressBar1.setMaximum(getRowCount());

        final int s = download.getStatus();

        if (s == Download.COMPLETE || s == Download.SKIPPED)
            progress++;
        else if (s == Download.CANCELLED)
            progress--;
        progressBar1.setValue(progress);

        if (getStatus() == Download.DOWNLOADING && (s == Download.COMPLETE || s == Download.ERROR || s == Download.SKIPPED)) {
            Download candidate = null;
            for (Download d : downloadList) {
                if (d.getStatus() == Download.DOWNLOADING) return;
                if (d.getStatus() == Download.PENDING && candidate == null) candidate = d;
            }
            if (candidate != null) candidate.resume(); // Start the next download
        }
    }

    public void resume() {
        setStatus(Download.DOWNLOADING);
        for (int i = 0; i < getRowCount(); i++) {
            final Download download = getDownload(i);
            if (download.getStatus() == Download.PENDING || download.getStatus() == Download.PAUSED) {
                download.resume();
                break;
            }
        }
    }

    public void pause() {
        setStatus(Download.PAUSED);
        for (int i = 0; i < getRowCount(); i++) {
            final Download download = getDownload(i);
            if (download.getStatus() == Download.DOWNLOADING)
                download.pause();
        }
    }

    public void cancel() {
        setStatus(Download.CANCELLED);
        for (int i = 0; i < getRowCount(); i++) {
            final Download download = getDownload(i);
            if (download.getStatus() == Download.DOWNLOADING
                    || download.getStatus() == Download.PAUSED) {
                download.cancel();
            }
        }
    }

    public void clear(boolean all) {
        final int rowCount = getRowCount();
        for (int i = rowCount - 1; i > -1; i--) {
            final Download download = getDownload(i);
            if (all || (download.getStatus() == Download.COMPLETE || download.getStatus() == Download.SKIPPED)) {
                download.cancel();
                clearDownload(i);
            }
        }
    }
}