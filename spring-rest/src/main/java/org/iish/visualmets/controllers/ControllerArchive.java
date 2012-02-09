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

package org.iish.visualmets.controllers;

import org.apache.solr.client.solrj.SolrServerException;
import org.iish.visualmets.dao.TocDao;
import org.iish.visualmets.datamodels.TocFolderItem;
import org.iish.visualmets.util.ControllerUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Controller
public class ControllerArchive {

    @Autowired
    private TocDao dao;

    /**
     * Returns a subsection of the archival table of content and it's associated objects
     *
     * @param eadId     Identifier of the archive
     * @param folderId  The identity of the parent folder in the archive
     * @param callback  If set, returns JSON. Otherwise XML
     * @return          The table of content of an archive and its objects
     * @throws SolrServerException
     */
    @RequestMapping(value="/archive/toc", method=RequestMethod.GET)
    public ModelAndView getFulllistArchive(
            @RequestParam(value = "eadId", required = false, defaultValue = "") String eadId,
            @RequestParam(value = "folderId", required = false, defaultValue = "0") String folderId,
            @RequestParam(value = "callback", required = false) String callback,
            HttpServletResponse response ) throws SolrServerException {
//        @RequestParam(value = "eadId", required = true) String eadId,

        ModelAndView mav = ControllerUtils.createModelAndViewPage("toc", callback, response);

        List<TocFolderItem> toc = dao.getEADFolders(eadId, folderId);
        mav.addObject("toc", toc);

        return mav;
    }


    /**
     * Returns a subsection of the archival table of content and it's associated objects
     *
     * @param eadId     Identifier of the archive
     * @param folderId  The identity of the parent folder in the archive
     * @param callback  If set, returns JSON. Otherwise XML
     * @return          The table of content of an archive and its objects
     * @throws SolrServerException
     */
    @RequestMapping(value="/archive/toc2", method=RequestMethod.GET)
    public ModelAndView getFulllistArchive2(
            @RequestParam(value = "eadId", required = false, defaultValue = "") String eadId,
            @RequestParam(value = "folderId", required = false, defaultValue = "0") String folderId,
            @RequestParam(value = "namespace", required = false, defaultValue = "0") int namespace,
            @RequestParam(value = "callback", required = false) String callback,
            HttpServletResponse response ) throws SolrServerException {

        // decide in which format the data should be returned (xml/json)
        ModelAndView mav = ControllerUtils.createModelAndViewPage("toc", callback, response);

        //
        List<TocFolderItem> toc = dao.getEADFolders2(eadId, folderId, namespace);
        mav.addObject("toc", toc);

        return mav;
    }
}