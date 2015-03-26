package org;

import org.apache.commons.io.IOUtils;

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

    public static String downloadWithDigest(final URL url, final File file) {

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
        final DigestInputStream digestInputStream = new DigestInputStream(url.openStream(), MessageDigest.getInstance("md5"));
        final FileOutputStream fileOutputStream = new FileOutputStream(file);
        IOUtils.copy(digestInputStream, fileOutputStream) ;
        final byte[] md5 = digestInputStream.getMessageDigest().digest();
        return asHex(md5);
    }

    private static final char[] HEX_CHARS = {'0', '1', '2', '3',
            '4', '5', '6', '7',
            '8', '9', 'a', 'b',
            'c', 'd', 'e', 'f',};
    /**
     * Turns array of bytes into string representing each byte as
     * unsigned hex number.
     *
     * @param hash Array of bytes to convert to hex-string
     * @return Generated hex string
     */
    public static String asHex (byte hash[]) {
        char buf[] = new char[hash.length * 2];
        for (int i = 0, x = 0; i < hash.length; i++) {
            buf[x++] = HEX_CHARS[(hash[i] >>> 4) & 0xf];
            buf[x++] = HEX_CHARS[hash[i] & 0xf];
        }
        return new String(buf);
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
