package org.iisg.visualmets.downloadmanager;

import javax.swing.*;
import javax.swing.table.TableCellRenderer;
import java.awt.*;

// This class renders ProgressRenderer JProgressBar in ProgressRenderer table cell.
class ProgressRenderer extends JProgressBar
        implements TableCellRenderer {

    // Constructor for org.objectrepository.download.ProgressRenderer.
    public ProgressRenderer(int min, int max) {
        super(min, max);
    }

    /* Returns this JProgressBar as the renderer
for the given table cell. */
    public Component getTableCellRendererComponent(
            JTable table, Object value, boolean isSelected,
            boolean hasFocus, int row, int column) {
        // Set JProgressBar's percent complete value.
        setValue((int) ((Float) value).floatValue());
        return this;
    }
}