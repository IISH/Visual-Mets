package org;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.net.URL;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Checksum
 */
public class Checksum {

    private static int BLENGTH = 242144;

    public static String generateMD5(final URL url, final File file) {

        try {
            return fromUrlToFileWithMD5(url, file);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        return null;
    }


    private static String fromUrlToFileWithMD5(URL url, File file) throws IOException, NoSuchAlgorithmException {
        byte[] buffer = new byte[BLENGTH];
        final DigestInputStream digestInputStream = new DigestInputStream(url.openStream(), MessageDigest.getInstance("md5"));
        final FileOutputStream fileOutputStream = new FileOutputStream(file);
        while (digestInputStream.read(buffer) != -1) {
            fileOutputStream.write(buffer);
        }
        fileOutputStream.close();

        final byte[] digest = digestInputStream.getMessageDigest().digest();
        String md5 = org.apache.commons.codec.digest.DigestUtils.md5Hex(digest);
        digestInputStream.close();

        return md5;
    }

    /**
     * Compares two md5 hashes. We cannot rely only on string comparisons, as some
     * hash implementations do not render a zero's at the left side of the string.
     */
    public static Boolean compare(String md5_A, String md5_B) {

        if (md5_A == null || md5_B == null) return false;

        final BigInteger md5_alfa;
        final BigInteger md5_beta;

        try {
            md5_alfa = new BigInteger(md5_A, 16);
            md5_beta = new BigInteger(md5_B, 16);
        } catch (NumberFormatException e) {
            return false;
        }

        return md5_beta.compareTo(md5_alfa) == 0;
    }

}
