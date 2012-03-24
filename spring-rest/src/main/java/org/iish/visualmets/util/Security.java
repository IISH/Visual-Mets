package org.iish.visualmets.util;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Security
 * <p/>
 * Restricts reading of documents to the specified list of domains.
 */
public class Security {

    private static List<Pattern> patterns = null;

    private static void getPatterns(String trusted) {
        if (patterns == null) {
            String[] expressions = trusted.toLowerCase().split(",|\\s|;");
            patterns = new ArrayList(expressions.length);
            for (String regex : expressions) {
                Pattern pattern = Pattern.compile(regex);
                patterns.add(pattern);
            }
        }
    }

    public static boolean authorize(String trusted, String host) {
        getPatterns(trusted);
        for (Pattern pattern : patterns) {
            final Matcher matcher = pattern.matcher(host);
            if (matcher.matches())
                return true;
        }
        throw new SecurityException("Server is not allowed to read from domain " + host);
    }
}
