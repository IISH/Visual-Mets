package org.iisg.visualmets.metsmaker;

/**
 * Author: Christian Roosendaal
 */

import au.edu.apsr.mtk.base.METSException;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class MetsMakerConsole {

    private static final String[] EXPECT = {
            "-inputFile",
            "-outputFolder",
            "-proxy"
    };

    public static void main(String[] argv) throws METSException, IOException, SAXException, ParserConfigurationException {
        Map<String, String> map = new HashMap(EXPECT.length);
        for (int i = 0; i < argv.length; i += 2) {
            map.put(argv[i], argv[i + 1]);
        }

        for (String key : EXPECT) {
            if (!map.containsKey(key)) {
                System.out.println("Expected case sensitive parameter: " + key + "\n");
                System.out.println("Example: java -jar metsmaker.jar -inputFile \"C:\\inputfile\" " +
                        " -outputFolder \"C:\\outputfolder\" -proxy \"http://www.example.org/\"" +
                        " [-objId 123456789] ");

                System.out.println("Optional parameters: -pidColumn [pid column header] -objId [object Id] -objectColumn [object column header] -pageColumn [page column header] ");

                System.exit(-1);
            }
        }

        MetsMaker conversion = new MetsMaker(map.get("-na"),
                map.get("-inputFile"),
                map.get("-proxy"),
                map.get("-outputFolder"),
                map.get("-pidColumn"),
                map.get("-pageColumn"),
                map.get("-objectColumn"));
    }
}