package org.iisg.visualmets.metsmaker;

/**
* Author: Christian Roosendaal
 */

import java.util.HashMap;
import java.util.Map;

public class Console {

    private static final String[] EXPECT = {
            "-inputFile",
            "-outputFolder",
            "-baseUrl"
    };

    public static void main(String[] argv) {
        Map<String, String> map = new HashMap(EXPECT.length);
        for (int i = 0; i < argv.length; i += 2) {
            map.put(argv[i], argv[i + 1]);
        }

        for (String key : EXPECT) {
            if (!map.containsKey(key)) {
                System.out.println("Expected case sensitive parameter: " + key + "\n");
                System.out.println("Example: java -jar metsmaker-1.0.jar -inputFile \"C:\\inputfile\" " +
                                   " -outputFolder \"C:\\outputfolder\" -baseUrl \"http://www.example.org/\"" +
                                   " [-objId 123456789] ");

                System.out.println("Optional parameters: -pidColumn [pid column header] -objId [object Id] -objectColumn [object column header] -pageColumn [page column header] ");

                System.exit(-1);
            }
        }

        MetsMaker conversion = new MetsMaker(   map.get("-inputFile"),
                                                map.get("-baseUrl"),
                                                map.get("-outputFolder"),
                                                map.get("-objId"),
                                                map.get("-pidColumn"),
                                                map.get("-objectColumn"),
                                                map.get("-pageColumn")  );
    }
}