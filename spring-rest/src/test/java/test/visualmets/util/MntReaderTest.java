package test.visualmets.util;

import org.iish.visualmets.datamodels.ImageItem;
import org.iish.visualmets.datamodels.PagerImageItem;
import org.iish.visualmets.datamodels.PagerItem;
import org.iish.visualmets.services.MtrReader;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;

@Ignore
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:application-context.xml", "classpath:dispatcher-servlet.xml"})
public class MntReaderTest {

    @Autowired
    MtrReader reader;

    @Test
    public void loadDocument() throws Exception {

        final PagerItem pagerItem = reader.getPager(null, "http://search.iisg.nl/1.xml", 1, 11, 10, "thumbnail");
      //  /**/final PagerItem pagerItem2 = reader.getPager(null, "http://api.iisg.nl/solr/mets/srw?query=iisg.identifier+%3D+%2210767897_EAD%3A447%22&version=1.1&operation=searchRetrieve&recordSchema=info%3Asrw%2Fschema%2F1%2Fmets&maximumRecords=10&startRecord=1&resultSetTTL=300&recordPacking=xml&recordXPath=&sortKeys=", "1", 1, 10, "thumbnail");

        final ArrayList<PagerImageItem> listofpages = pagerItem.getListofpages();
        for (PagerImageItem imageItem : listofpages ){
            final String url = imageItem.getUrl();
            final ImageItem thumbnail = reader.getUrl(null, "http://search.iisg.nl/1.xml", imageItem.getPageid(), "thumbnail");
            String test = thumbnail.getUrl()   ;
            String s = null;
        }

    }

}
