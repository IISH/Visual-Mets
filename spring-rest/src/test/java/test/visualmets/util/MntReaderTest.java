package test.visualmets.util;

import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@Ignore
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:application-context.xml"})
public class MntReaderTest {

    @Test
    public void loadDocument() throws Exception {

        Assert.assertTrue(true); // ToDo: add out unit tests
    }
}
