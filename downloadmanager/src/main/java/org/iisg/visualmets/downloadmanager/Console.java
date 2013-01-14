package org.iisg.visualmets.downloadmanager;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * ToDo: instantiate via spring
 */
public class Console {

    public static void main(String[] args) throws IOException {

        final Properties headers = new Properties();
        final File file = new File("./downloadmanager.txt");
        if (file.exists()) headers.load(new FileInputStream(file));

        final FormPreview frame = new FormPreview(headers);
        frame.setContentPane(frame.getPanel());
        frame.setTitle("Download Manager");
        frame.pack();
        frame.setVisible(true);
    }

}
