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
    public void test1(){
        getResources();

        MetsMaker metsMaker = new MetsMaker(testdataLocation,"http://hdl.handle.net",testdataLocation,"test","PID");


    }







}
