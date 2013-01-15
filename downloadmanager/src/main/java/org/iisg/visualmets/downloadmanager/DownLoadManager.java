package org.iisg.visualmets.downloadmanager;

import javax.swing.*;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * DownLoadManager
 */
public class DownLoadManager extends JApplet {

    @Override
    public void init() {
        try {
            SwingUtilities.invokeAndWait(new Runnable() {
                public void run() {
                    createGUI(getParameter("metsId"));
                }
            });
        } catch (Exception e) {
            System.err.println("createGUI didn't successfully complete");
        }
    }

    public void createGUI(String metsId) {
        final FormPreview frame = new FormPreview(loadProperties(), metsId);
        setContentPane(frame.getMainPanel());
        frame.getMainPanel().setVisible(true);
    }

    public static void main(String[] args) throws IOException {

        JFrame frame = new JFrame();
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent e) {
                System.exit(0);
            }
        });

        final String metsId = (args.length == 0) ? null : args[0];
        frame.setContentPane(new FormPreview(loadProperties(), metsId).getMainPanel());
        frame.setTitle("Download Manager");
        frame.pack();
        frame.setVisible(true);
    }

    private static Properties loadProperties() {
        final Properties headers = new Properties();
        final File file = new File("./downloadmanager.txt");
        if (file.exists()) try {
            headers.load(new FileInputStream(file));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return headers;
    }

}