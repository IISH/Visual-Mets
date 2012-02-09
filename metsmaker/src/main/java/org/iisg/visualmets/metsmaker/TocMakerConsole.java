package org.iisg.visualmets.metsmaker;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by IntelliJ IDEA.
 * User: cro
 * Date: 3-10-11
 * Time: 13:22
 * To change this template use File | Settings | File Templates.
 */
public class TocMakerConsole {

    private static final String[] EXPECT = {
            "-inputFile",
            "-outputFile"
    };

    public static void main(String[] argv) {
        // OPMERKING: hier worden de dos parameters binnengehaald
        // er wordt vanuit gegaan dat er steeds eerst een parameter is en dan de waarde van de parameter
        Map<String, String> map = new HashMap(EXPECT.length);
        for (int i = 0; i < argv.length; i += 2) {
            map.put(argv[i], argv[i + 1]);
        }

        for (String key : EXPECT) {
            if (!map.containsKey(key)) {
                System.out.println("Expected case sensitive parameter: " + key + "\n");
                System.out.println("Example: java -jar tocmaker-1.0.jar -inputFile \"C:\\inputfile.csv\"  -outputFile \"C:\\outputfile.xml\" ");
                System.exit(-1);
            }
        }

        TocMaker conversion = new TocMaker(map.get("-inputFile"), map.get("-outputFile"));
    }
}
