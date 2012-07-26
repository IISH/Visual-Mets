package org.iisg.visualmets.metsmaker;

import org.junit.BeforeClass;
import org.junit.Test;

import java.io.File;
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


    @BeforeClass
    public static void setUp() throws ClassNotFoundException {
        //


    }

    public void getResources(){
        URL url = getClass().getResource("/");
        testdataLocation = url.getFile() + "data" + File.separator;
        System.out.println(testdataLocation);
    }

    @Test
    public void testWithMetsHeaderFile(){
        getResources();

        String testFile = testdataLocation + File.separator + "withMetsHeader" + File.separator + "test.csv";
        MetsMaker metsMaker = new MetsMaker(testFile,"http://hdl.handle.net",testdataLocation,"test","PID", "", "");


        // todo: getfilemap met metsReader, zie verderop in de visual mets code. Dan testen of te verwachten strings bestaan.

        // todo: mets.validate() runnen en checken of de geproduceerde mets validated is.

    }

    @Test
    public void testWithoutMetsHeaderFile(){
        getResources();

        String testFile = testdataLocation + File.separator + "withoutMetsHeader" + File.separator + "test.csv";
        MetsMaker metsMaker = new MetsMaker(testFile,"http://hdl.handle.net",testdataLocation,"test","PID", "", "");


    }







}
