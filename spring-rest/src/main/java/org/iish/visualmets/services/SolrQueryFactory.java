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

package org.iish.visualmets.services;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.embedded.EmbeddedSolrServer;
import org.apache.solr.client.solrj.impl.CommonsHttpSolrServer;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.iish.visualmets.datamodels.TocFolderItem;

import java.util.List;

public abstract class SolrQueryFactory {
    private EmbeddedSolrServer solrServer;

    public void setSolrServer(EmbeddedSolrServer solrServer) {
        this.solrServer = solrServer;
    }

    public QueryResponse getSolrResponse(SolrQuery solrQuery) throws SolrServerException {

        QueryResponse queryResponse = solrServer.query(solrQuery);
        return queryResponse;
    }
}