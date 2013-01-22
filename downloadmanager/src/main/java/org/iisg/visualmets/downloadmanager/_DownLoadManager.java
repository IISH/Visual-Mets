package org.iisg.visualmets.downloadmanager;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;
import javax.swing.*;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.util.Properties;

/**
 * DownloadManager
 */
public class _DownLoadManager extends JApplet {

    @Override
    public void init() {
        try {
            SwingUtilities.invokeAndWait(new Runnable() {
                public void run() {
                    createGUI(getParameter("metsId"));
                }
            });
            loadKeystore(getCodeBase().toString());
        } catch (Exception e) {
            System.err.println("createGUI didn't successfully complete: " + e.getMessage());
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

        final String[] locations = new String[]{System.getProperty("user.home", ".."), "."};
        final Properties headers = new Properties();

        for (String l : locations) {
            final File file = new File(l, "downloadmanager.txt");
            if (file.exists()) try {
                headers.load(new FileInputStream(file));
                break;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return headers;
    }

    private static void loadKeystore(String codebase) throws KeyStoreException, NoSuchAlgorithmException,
            KeyManagementException, IOException,
            CertificateException {

        final KeyStore keystore = KeyStore.getInstance("jks");

        keystore.load(_DownLoadManager.class.getResourceAsStream("/client-keystore"), null);
        //URL url = new URL(codebase + "client-keystore.jks");
        //keystore.load(url.openStream(), null);

        final TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        tmf.init(keystore);
        final SSLContext content = SSLContext.getInstance("TLS");
        content.init(null, tmf.getTrustManagers(), null);
        SSLContext.setDefault(content);
    }
}