package org.iisg.visualmets.downloadmanager;

import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.table.TableCellRenderer;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

/**
 * ImageRenderer
 * <p/>
 * Display ImageIcons in a separate thread.
 */
public class ImageRenderer implements TableCellRenderer {
    @Override
    public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {

        final JLabel label = new JLabel();
        final Download download = ((DownloadsTableModel) table.getModel()).getDownload(row);
        if (value != null && value instanceof String && download.getFilename() != null) {
            int i = download.getFilename().getName().indexOf(".");
            String filename = (i == -1) ? download.getFilename().getName() : download.getFilename().getName().substring(0, i);
            File preview = new File(download.getFilename().getParentFile().getParentFile(), "preview/" + filename + ".png");
            if (preview.exists() && preview.length() != 0) {
                label.setIcon(new ImageIcon(preview.getAbsolutePath()));
            } else if (download.getStatus() == Download.COMPLETE || download.getStatus() == Download.SKIPPED) {
                if (!preview.getParentFile().exists()) preview.getParentFile().mkdirs();
                final Image scaledInstance;
                try {
                    scaledInstance = ImageIO.read(download.getFilename()).getScaledInstance(-1, 105, Image.SCALE_SMOOTH);
                } catch (Exception e) {
                    return label;
                }
                final BufferedImage bufferedImage = new BufferedImage(scaledInstance.getWidth(null), scaledInstance.getHeight(null), BufferedImage.TYPE_INT_RGB);
                bufferedImage.getGraphics().drawImage(scaledInstance, 0, 0, null);
                try {
                    ImageIO.write(bufferedImage, "png", preview);
                } catch (IOException e) {
                    return label;
                }
                label.setIcon(new ImageIcon(bufferedImage));
            }
        }
        return label;
    }
}
