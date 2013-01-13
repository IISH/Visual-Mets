package org.iisg.visualmets.downloadmanager;

import javax.swing.*;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;

/**
 * ToDo: instantiate via spring
 */
public class Console {

    public Console() {
        final JFrame frame = new JFrame("FormPreview");
        frame.setContentPane(new FormPreview().getPanel());
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.pack();
        // Handle window closing events.
        frame.addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent e) {
                System.exit(0);
            }
        });
        frame.setVisible(true);
    }

    public static void main(String[] args) {
        new Console();
    }

}
