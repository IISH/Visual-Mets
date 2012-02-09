package org.iish.visualmets.dao;

import org.apache.solr.client.solrj.SolrServerException;
import org.iish.visualmets.datamodels.TocFolderItem;

import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: lwo
 * Date: 5/23/11
 * Time: 11:34 AM
 * To change this template use File | Settings | File Templates.
 */
public interface TocDao {
    List<TocFolderItem> getEADFolders(String eadId, String group) throws SolrServerException;
    List<TocFolderItem> getEADFolders2(String eadId, String group, int namespace) throws SolrServerException;
}
