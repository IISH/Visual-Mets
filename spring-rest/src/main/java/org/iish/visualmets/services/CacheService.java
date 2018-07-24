package org.iish.visualmets.services;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import javax.imageio.ImageIO;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * CacheService
 * <p/>
 * Stores and retrieves web resources to cache
 */
public class CacheService {

    @Value("#{visualmetsProperties['proxy.host']}")
    private String proxy_host = "/";

    private String trusted;
    private long cacheLimitInBytes;
    private String cacheFolder;
    private long cacheLimitInSeconds;

    private Logger log = Logger.getLogger(getClass());

    public Document loadDocument(String url) {

        final String filename = SHA1(url);
        final String file = cacheFolder + filename;
        final File f = new File(file);
        Document document;

        final DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setIgnoringComments(true);
        dbf.setNamespaceAware(true);
        dbf.setValidating(false);
        DocumentBuilder db;

        try {
            db = dbf.newDocumentBuilder();
        } catch (ParserConfigurationException e) {
            log.error(e);
            throw new SecurityException(e.getMessage());
        }

        if (f.exists())
            try {
                return db.parse(f);
            } catch (SAXException e) {
                log.error(e);
                throw new SecurityException(e.getMessage());
            } catch (IOException e) {
                log.error(e);
                throw new SecurityException(e.getMessage());
            }

        try {
            authorize(trusted, new URI(url).getHost());
        } catch (URISyntaxException e) {
            log.error(url);
            log.error(e);
            throw new SecurityException(e.getMessage());
        }

        try {
            document = db.parse(url);
        } catch (SAXException e) {
            log.error(url);
            log.error(e);
            throw new SecurityException(e.getMessage());
        } catch (IOException e) {
            log.error(e);
            throw new SecurityException(e.getMessage());
        }

        try {
            normalise(document.getDocumentElement(), file);
        } catch (IOException e) {
            log.error(e);
            throw new SecurityException(e.getMessage());
        } catch (TransformerException e) {
            log.error(e);
            throw new SecurityException(e.getMessage());
        }

        return document;
    }

    public BufferedImage loadImage(String url) {
        final URL _url;
        try {
            _url = new URL(url);
        } catch (MalformedURLException e) {
            log.error(e);
            throw new SecurityException(e.getMessage());
        }

        return loadImage(_url);
    }

    private BufferedImage loadImage(URL url) {
        final String filename = SHA1(url.toString());
        final String file = cacheFolder + filename;
        final File f = new File(file);

        try {
            if (f.exists()) {
                return ImageIO.read(f);
            } else {
                final BufferedImage img = ImageIO.read(url);
                emptyCache();
                ImageIO.write(img, "jpg", f);
                return img;
            }
        } catch (IOException e) {
            f.delete();
            throw new SecurityException(e.getMessage());
        }
    }

    public InputStream inputStream(String url) {

        loadDocument(url);
        final String filename = SHA1(url);
        final String file = cacheFolder + filename;
        File f = new File(file);

        try {
            return new FileInputStream(f);
        } catch (FileNotFoundException e) {
            log.error(e);
            throw new SecurityException(e.getMessage());
        }
    }

    /**
     * The document is loaded, transformed and stored to a cache.
     * ToDo: depending on specifications, apply xslt stylesheets.
     *
     * @param node
     * @param file
     * @throws IOException
     * @throws TransformerException
     */
    private void normalise(Node node, String file) throws IOException, TransformerException {

        emptyCache();
        TransformerFactory transformerFactory =
                TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        DOMSource source = new DOMSource(node);
        StreamResult result = new StreamResult(new File(file));
        transformer.transform(source, result);
    }

    /**
     * Clear the cache in case it exceeds the limit.
     *
     * @return
     */
    private int emptyCache() throws IOException {
        int count = 0;
        File folder = new File(cacheFolder);
        if (!folder.exists())
            folder.mkdirs();
        final boolean hasExpired = folder.lastModified() + cacheLimitInSeconds < new Date().getTime();
        if (folder.length() > cacheLimitInBytes || hasExpired) {
            final File[] files = folder.listFiles();
            if (files != null)
                for (File file : files) {
                    try {
                        file.delete();
                        count++;
                    } catch (Exception e) {
                    }
                }
        }
        return count;
    }

    private String SHA1(String text) {
        MessageDigest md;
        try {
            md = MessageDigest.getInstance("SHA-1");
        } catch (NoSuchAlgorithmException e) {
            log.error(e);
            return null;
        }
        byte[] sha1hash = new byte[40];
        try {
            md.update(text.getBytes("iso-8859-1"), 0, text.length());
        } catch (UnsupportedEncodingException e) {
            log.error(e);
        }
        sha1hash = md.digest();
        return convertToHex(sha1hash);
    }

    private static String convertToHex(byte[] data) {
        StringBuffer buf = new StringBuffer();
        for (int i = 0; i < data.length; i++) {
            int halfbyte = (data[i] >>> 4) & 0x0F;
            int two_halfs = 0;
            do {
                if ((0 <= halfbyte) && (halfbyte <= 9))
                    buf.append((char) ('0' + halfbyte));
                else
                    buf.append((char) ('a' + (halfbyte - 10)));
                halfbyte = data[i] & 0x0F;
            } while (two_halfs++ < 1);
        }
        return buf.toString();
    }

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

    public void setTrusted(String trusted) {
        this.trusted = trusted;
    }

    public void setCacheFolder(String cacheFolder) {
        this.cacheFolder = cacheFolder;
    }

    public void setCacheLimitInBytes(long cacheLimitInBytes) {
        this.cacheLimitInBytes = cacheLimitInBytes;
    }

    public void setCacheLimitInSeconds(long cacheLimitInSeconds) {
        this.cacheLimitInSeconds = 1000L * cacheLimitInSeconds;
    }

}
