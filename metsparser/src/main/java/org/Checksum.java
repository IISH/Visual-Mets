package org;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;

/**
 * Checksum
 */
public class Checksum {


    public static String generateMD5(final File file) throws NoSuchAlgorithmException, IOException {

        FileInputStream fis = new FileInputStream(file);
        String md5 = org.apache.commons.codec.digest.DigestUtils.md5Hex(fis);
        fis.close();

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
