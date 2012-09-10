package org.iisg.visualmets.metsmaker;

import au.edu.apsr.mtk.base.METSException;
import org.junit.Test;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.IOException;
import java.net.URL;

/**
 * Created with IntelliJ IDEA.
 * User: cro
 * Date: 25-7-12
 * Time: 12:03
 * To change this template use File | Settings | File Templates.
 */


public class MetsMakerTest {

    public String testdataLocation;
    private static String proxy = "http://hdl.handle.net";


    public void getResources() {
        URL url = getClass().getResource("/");
        testdataLocation = url.getFile() + "data" + File.separator;
        System.out.println(testdataLocation);
    }

    @Test
    public void testWithMetsHeaderFile() throws METSException, IOException, SAXException, ParserConfigurationException {
        getResources();
        String testFile = testdataLocation + File.separator + "withMetsHeader" + File.separator + "withMetsHeader.csv";
        new MetsMaker("12345", testFile, proxy, testdataLocation, "PID", null, null);
    }

    @Test
    public void testWithoutMetsHeaderFile() throws METSException, IOException, SAXException, ParserConfigurationException {
        getResources();
        String testFile = testdataLocation + File.separator + "withoutMetsHeader" + File.separator + "withoutMetsHeader.csv";
        new MetsMaker("12345", testFile, proxy, testdataLocation, "PID", null, null);
    }
}
