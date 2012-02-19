package org.iish.visualmets.dao;

import org.iish.visualmets.datamodels.TocFolderItem;

import java.util.List;

public interface TocDao {
    List<TocFolderItem> getEADFolders(String eadId, String group, int namespace);
}
