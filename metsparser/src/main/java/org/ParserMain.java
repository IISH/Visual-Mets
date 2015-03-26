package org;

import au.edu.apsr.mtk.base.METSException;
import org.apache.commons.cli.*;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;

/**
 * ParserMain
 */
public class ParserMain {

    public static void main(String[] args) throws ParseException, IOException, METSException, ParserConfigurationException, SAXException {

        final Options options = new Options();
        options.addOption(
                OptionBuilder.isRequired()
                        .withArgName("file")
                        .hasArg()
                        .withDescription("the METS file to parse")
                        .create("metsfile"));
        options.addOption(
                OptionBuilder.isRequired()
                        .withArgName("folder")
                        .hasArg()
                        .withDescription("the METS file to parse")
                        .create("targetdirectory"));
        options.addOption(
                OptionBuilder.isRequired()
                        .withArgName("string")
                        .hasArg()
                        .withDescription("the web service access token")
                        .create("accesstoken"));

        CommandLine cmd = null;
        final CommandLineParser parser = new GnuParser();
        try {
            cmd = parser.parse(options, args);
        } catch (ParseException e) {
            System.err.println("Parsing failed.  Reason: " + e.getMessage());
            System.exit(1);
        }

        final RecreateBulk recreateFolder = new RecreateBulk(
                cmd.getOptionValue("metsfile"),
                cmd.getOptionValue("targetdirectory"),
                cmd.getOptionValue("accesstoken"));
        recreateFolder.recreate();
    }

}
