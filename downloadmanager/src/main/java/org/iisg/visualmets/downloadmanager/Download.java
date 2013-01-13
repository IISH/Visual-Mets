package org.iisg.visualmets.downloadmanager;

import org.apache.tika.config.TikaConfig;
import org.apache.tika.exception.TikaException;
import org.apache.tika.mime.MimeType;
import org.apache.tika.mime.MimeTypeException;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Observable;

// This class downloads a file from a URL.
final class Download extends Observable implements Runnable {

    // Max size of download buffer.
    private static final int MAX_BUFFER_SIZE = 1024;

    // These are the status names.
    public static final String STATUSES[] = {"Downloading",
            "Paused", "Complete", "Cancelled", "Error"};

    // These are the status codes.
    public static final int DOWNLOADING = 0;
    public static final int PAUSED = 1;
    public static final int COMPLETE = 2;
    public static final int CANCELLED = 3;
    public static final int ERROR = 4;

    public static final int FILE_TYPE_METS = 0;
    public static final int FILE_TYPE_THUMBNAIL = 1;
    public static final int FILE_TYPE_ANY = 2;

    public String downloadFolder; // download folder

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

    public boolean isChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    private boolean checked;

    public Download(String href, String downloadFolder, int status, boolean checked) throws MalformedURLException {
        start(new URL(href), downloadFolder, status, checked);
    }

    // Constructor for Download.
    public Download(URL url, String downloadFolder, int status, boolean checked) {
        start(url, downloadFolder, status, checked);
    }

    private void start(URL url, String downloadFolder, int status, boolean checked) {
        this.url = url;
        size = -1;
        downloaded = 0;
        this.status = status;
        this.downloadFolder = downloadFolder;
        this.setChecked(checked);

        // Begin the download.
        download();
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

    // Mark this download as having an error.
    private void error() {
        status = ERROR;
        stateChanged();
    }

    // Start or resume downloading.
    private void download() {
        Thread thread = new Thread(this);
        thread.start();
    }

    // Get file name portion of URL. If it has no known extension... we add one based on the ContentType
    private void setFileName(URL url, String contentType) throws IOException, MimeTypeException, TikaException {
        final String tmp1 = url.getFile();
        String tmp2 = tmp1.substring(tmp1.lastIndexOf('/') + 1);
        if (tmp1.contains(".")) {
            setFilename(folder(tmp2));
        } else {
            final MimeType mimeType = TikaConfig.getDefaultConfig().getMimeRepository().forName(contentType);
            if (mimeType == null || !mimeType.getName().contains("/")) {
                setFilename(folder(tmp2));
            } else
                setFilename(folder(tmp2 + "." + mimeType.getName().substring(mimeType.getName().lastIndexOf("/") + 1)));
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

            // Connect to server.
            connection.connect();

            // Make sure response code is in the 200 range.
            if (connection.getResponseCode() / 100 != 2) {
                error();
            }

            // Check for valid content length.
            int contentLength = connection.getContentLength();
            if (contentLength < 1) {
                error();
            }

            /* Set the size for this download if it
        hasn't been already set. */
            if (size == -1) {
                size = contentLength;
                stateChanged();
            }

            setFileName(url, connection.getContentType());
            if (downloaded == 0 && getFilename().length() == size) {
                downloaded = size;
                status = COMPLETE;
                stateChanged();
            } else {
                // Open file and seek to the end of it.
                downloaded = getFilename().length();
                file = new RandomAccessFile(getFilename(), "rw");
                file.seek(downloaded);
                stream = connection.getInputStream();
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
        } catch (Exception e) {
            error();
        } finally {
            // Close file.
            if (file != null) {
                try {
                    file.close();
                } catch (Exception e) {
                }
            }

            // Close connection to server.
            if (stream != null) {
                try {
                    stream.close();
                } catch (Exception e) {
                }
            }
        }
    }

    // Notify observers that this download's status has changed.
    private void stateChanged() {
        setChanged();
        notifyObservers();
    }
}