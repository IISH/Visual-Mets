package org.iisg.visualmets.downloadmanager;

import java.io.File;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Observable;
import java.util.Properties;

// This class downloads a file from a URL.
final class Download extends Observable implements Runnable {

    // Max size of download buffer.
    private static final int MAX_BUFFER_SIZE = 1024;

    // These are the status names.
    public static final String STATUSES[] = {"Downloading",
            "Paused", "Complete", "Cancelled", "Error", "Skipped", "Pending"};

    // These are the status codes.
    public static final int DOWNLOADING = 0;
    public static final int PAUSED = 1;
    public static final int COMPLETE = 2;
    public static final int CANCELLED = 3;
    public static final int ERROR = 4;
    public static final int SKIPPED = 5;
    public static final int PENDING = 6;

    public String downloadFolder; // download folder
    private Properties headers;

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    private String errorMessage;

    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }

    private String order;

    public File getFilename() {
        return filename;
    }

    public void setFilename(File filename) {
        this.filename = filename;
    }

    private File filename;

    private URL url; // download URL
    private long size; // size of download in bytes
    private long downloaded; // number of bytes downloaded
    private int status; // current status of download

    public Download(String href, String downloadFolder, int status, String order, Properties headers) throws MalformedURLException {
        start(new URL(href), downloadFolder, status, order, headers);
    }

    // Constructor for Download.
    public Download(URL url, String downloadFolder, int status, String order, Properties headers) {
        start(url, downloadFolder, status, order, headers);
    }

    private void start(URL url, String downloadFolder, int status, String order, Properties headers) {
        this.url = url;
        size = -1;
        downloaded = 0;
        this.status = status;
        this.downloadFolder = downloadFolder;
        if (order == null) {
            order = url.getFile().substring(url.getFile().lastIndexOf("/") + 1);
        }
        this.order = order;
        this.headers = headers;

        // Begin the download.
        if (status == PENDING) {
            stateChanged();
        } else {
            download();
        }
    }

    // Get this download's URL.
    public String getUrl() {
        return url.toString();
    }

    // Get this download's size.
    public long getSize() {
        return size;
    }

    // Get this download's progress.
    public float getProgress() {
        return ((float) downloaded / size) * 100;
    }

    // Get this download's status.
    public int getStatus() {
        return status;
    }

    // Pause this download.
    public void pause() {
        status = PAUSED;
        stateChanged();
    }

    // Resume this download.
    public void resume() {
        status = DOWNLOADING;
        stateChanged();
        download();
    }

    // Cancel this download.
    public void cancel() {
        status = CANCELLED;
        stateChanged();
    }

    // Skip this download.
    public void skip() {
        status = SKIPPED;
        stateChanged();
    }

    // Skip this download.
    public void pending() {
        status = PENDING;
        stateChanged();
    }

    // Mark this download as having an error.
    private void error(String errorMessage) {
        setErrorMessage(errorMessage);
        status = ERROR;
        stateChanged();
    }

    // Start or resume downloading.
    private void download() {
        Thread thread = new Thread(this);
        thread.start();
    }

    // Get file name portion of URL. If it has no known extension... we add one based on the ContentType
    private void setFilenameWithExtension(String contentType) {
        if (order.contains(".")) {
            setFilename(folder(order));
        } else {
            setFilename(folder(order + "." + MimeType.forName(contentType)));
        }
    }

    private File folder(String filename) {
        final File folder = new File(downloadFolder);
        folder.mkdirs();
        return new File(folder, filename);
    }

    // Download file.
    public void run() {

        RandomAccessFile file = null;
        InputStream stream = null;

        try {
            // Open connection to URL.
            HttpURLConnection connection =
                    (HttpURLConnection) url.openConnection();

            // Specify what portion of file to download.
            connection.setRequestProperty("Range",
                    "bytes=" + downloaded + "-");

            for (String key : headers.stringPropertyNames()) {
                String value = headers.getProperty(key);
                if (value != null) connection.addRequestProperty(key, value);
            }

            // Connect to server.
            connection.connect();

            // Make sure response code is in the 200 range.
            if (connection.getResponseCode() / 100 != 2) {
                if (connection.getResponseCode() == 416) {
                    getFilename().delete();
                }
                error("The response code " + connection.getResponseCode() + " is not in the 200 range. Select resume to retry.");
            }

            // Check for valid content length.
            int contentLength = connection.getContentLength();
            if (contentLength < 1) {
                error("Invalid content length");
            }

            /* Set the size for this download if it
        hasn't been already set. */
            if (size == -1) {
                size = contentLength;
                stateChanged();
            }

            setFilenameWithExtension(connection.getContentType());
            file = new RandomAccessFile(getFilename(), "rw");
            stream = connection.getInputStream();

            if (downloaded == 0 && getFilename().length() == size) {
                downloaded = size;
                status = SKIPPED;
                stateChanged();
            } else {
                // Open file and seek to the end of it.
                if (downloaded == 0) downloaded = getFilename().length();
                file.seek(downloaded);
            }

            while (status == DOWNLOADING) {
                /* Size buffer according to how much of the
           file is left to download. */
                byte buffer[];
                if (size - downloaded > MAX_BUFFER_SIZE) {
                    buffer = new byte[MAX_BUFFER_SIZE];
                } else {
                    buffer = new byte[(int) (size - downloaded)];
                }

                // Read from server into buffer.
                int read = stream.read(buffer);
                if (read == -1)
                    break;

                // Write buffer to file.
                file.write(buffer, 0, read);
                downloaded += read;
                stateChanged();
            }

            /* Change status to complete if this point was
       reached because downloading has finished. */
            if (status == DOWNLOADING) {
                status = COMPLETE;
                stateChanged();
            }

            if (status == CANCELLED) {
                getFilename().delete();
            }

        } catch (Exception e) {
            error(e.getMessage());
            if (getFilename() != null) {
                downloaded = 0;
                status = ERROR;
                getFilename().delete();
            }
        } finally {
            if (stream != null) {
                try {
                    stream.close();
                } catch (Exception e) {
                }
            }

            if (file != null) {
                try {
                    file.close();
                } catch (Exception e) {
                }
            }

            if (getFilename() != null && getFilename().length() == 0) getFilename().delete();
        }

    }

    // Notify observers that this download's status has changed.
    private void stateChanged() {
        setChanged();
        notifyObservers();
    }
}