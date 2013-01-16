package org.iisg.visualmets.downloadmanager;

import java.io.*;
import java.util.HashMap;

/**
 * MimeType
 * <p/>
 * The tika package is rather large. Hence this resource will function as a light contentType - extension map.
 */
public class MimeType {

    private static HashMap<String, String> mimeRepository;
    private static boolean loaded = false;

    private static synchronized HashMap<String, String> getMimeRepository() {
        if (!loaded) {
            mimeRepository = new HashMap<String, String>();
            final InputStream inputStream = MimeType.class.getResourceAsStream("/contenttype.txt");
            final BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
            String line;
            try {
                while ((line = br.readLine()) != null) {
                    final String[] split = line.split(",");
                    if (!mimeRepository.containsKey(split[1])) mimeRepository.put(split[1], split[0]);
                }
            } catch (IOException e) {
                System.err.println(e.getMessage());
                System.exit(-1);
            }
            loaded = true;
        }
        return mimeRepository;
    }

    public static String forName(String contentType) {
        final String[] split = contentType.split(";");
        String extension = getMimeRepository().get(split[0].trim().toLowerCase());
        if (extension == null) extension = "";
        return extension;
    }

}
