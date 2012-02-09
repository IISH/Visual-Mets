package org.iish.visualmets.dao;

import org.iish.visualmets.datamodels.ImageItem;
import org.iish.visualmets.datamodels.PagerItem;

/**
 * Created by IntelliJ IDEA.
 * User: lwo
 * Date: 5/23/11
 * Time: 11:29 AM
 * To change this template use File | Settings | File Templates.
 */
public interface DocumentDao {
    // functie moet een datamodel teruggeven
    ImageItem getUrl(String eadId, String metsId, int pageId, String use) throws Exception;

    // moet een datamodel terug geven: label, url, order ( pagina positie ) en use.
    // Er wordt in dit overzicht gepaged... in het data model moet duidelijk zijn wat de eerste en laatste pagina's zijn.
    PagerItem getPager(String eadId, String metsId, int pageId, int start, int rows, String use) throws Exception;

    PagerItem getPagerPageInfo(String eadId, String metsId, int pageId, int start, int rows, String use) throws Exception;
}
