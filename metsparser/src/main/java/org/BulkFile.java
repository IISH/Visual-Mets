package org;

import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.net.URL;
import java.security.MessageDigest;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * BulkFile
 */
public class BulkFile {

    private String title;
    private String created;
    private String accessRights;
    private String path;
    private String href;
    private String checksum;
    private long length;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public long getCreated() {
        final SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
        try {
            return format.parse(created).getTime();
        } catch (ParseException e) {
            e.printStackTrace();
            System.exit(1);
        }
        return 0;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public String getAccessRights() {
        return accessRights;
    }

    public void setAccessRights(String accessRights) {
        this.accessRights = accessRights;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getHref() {
        return href;
    }

    public void setHref(String href) {
        this.href = href;
    }

    public void setChecksum(String checksum) {
        this.checksum = checksum;
    }

    public String getChecksum() {
        return checksum;
    }

    public void setLength(long length) {
        this.length = length;
    }

    public static boolean writeFolder(BulkFile bulkFile) {
        final File file = new File(bulkFile.getPath(), bulkFile.getTitle());
        return file.mkdir();
    }

    public static boolean writeFile(BulkFile bulkFile) throws IOException {

        final String environment = System.getProperty("environment", "PRODUCTION");
        if (environment.equalsIgnoreCase("production"))
            return writeFileFromUrl(bulkFile);
        else
            return writeDummyFile(bulkFile);
    }

    private static boolean writeFileFromUrl(BulkFile bulkFile) throws IOException {
        // TODO: download the file and place it.
        final URL url = new URL(bulkFile.getHref());
        final File file = new File(bulkFile.getPath(), bulkFile.getTitle());
        final String md5 = Checksum.generateMD5(url, file);
        if (!file.setLastModified(bulkFile.getCreated())) {
            System.err.write("Unable to set date ".getBytes());
            System.exit(1);
        }

        if (!Checksum.compare(md5, bulkFile.getChecksum())) {
            System.err.write("Checksum does not match.".getBytes());
            System.exit(1);
        }

        return true;
    }

    private static boolean writeDummyFile(BulkFile bulkFile) {

        final File file = new File(bulkFile.getPath(), bulkFile.getTitle());
        try {
            final FileOutputStream fileOutputStream = new FileOutputStream(file);
            fileOutputStream.write(0);
            fileOutputStream.close();
            if (!file.setLastModified(bulkFile.getCreated())) {
                System.err.write("Unable to set date ".getBytes());
                System.exit(1);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return false;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }

}
