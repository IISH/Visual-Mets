/*
 * Copyright 2010 International Institute for Social History, The Netherlands.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.iish.visualmets.datamodels;

import java.util.ArrayList;
import java.util.List;

public class TocFolderItem
{
    private static final long serialVersionUID = 7526471155622776147L;

    private String title;
    private String index;
    private String haschildren;

    public String getHaschildren() {
        return haschildren;
    }

    public void setHaschildren(Object haschildren) {
        this.haschildren = (haschildren == null)
            ? "false"
            : String.valueOf(haschildren);
    }


    private List<TocFolderItem> breadcrumbs;
    private List<TocMetsItem> metsitems;
    private List<TocMetsItem> docs;

    public TocFolderItem()
    {
        this.breadcrumbs = new ArrayList<TocFolderItem>();
        this.metsitems = new ArrayList<TocMetsItem>();
        this.docs = new ArrayList<TocMetsItem>();
    }

    public List<TocFolderItem> getBreadcrumbs() {
        return breadcrumbs;
    }

    public List<TocMetsItem> getMetsitems() {
        return metsitems;
    }

    public List<TocMetsItem> getDocs() {
        return docs;
    }

    public void setBreadcrumbs(List<TocFolderItem> breadcrumbs) {
        this.breadcrumbs = breadcrumbs;
    }

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void add(TocMetsItem item)
    {
        metsitems.add(item);
    }

    public void add(TocFolderItem item)
    {
        breadcrumbs.add(item);
    }

    public void addDocs(TocMetsItem item)
    {
        docs.add(item);
    }
}
