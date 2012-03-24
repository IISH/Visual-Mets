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

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/*
* Used for online API testing
* 
* Created by IntelliJ IDEA.
* Date: 16-okt-2010
* Time: 14:38:06
*
* @author: Lucien van Wouw <lwo@iisg.nl>
*/

@Controller

public class StaticPageController {

    @Value("#{visualmetsProperties['proxy.host']}")
    private String proxy_host = "/";

    /**
     * Needed because the web.xml welcome-url to index.html is ignored.
     */
    @RequestMapping(value = "/")
    public ModelAndView indexHtml(HttpServletRequest request,
                                  HttpServletResponse response) throws Exception {
        return getHtmlPage("index.html", request, response);
    }

    @RequestMapping("/{pageName}.html")
    public ModelAndView getHtmlPage(
            @PathVariable("pageName") String pageName,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {

        response.setContentType("text/html; charset=utf-8");

        ModelAndView mav = new ModelAndView(pageName + ".html");

        return mav;
    }

    @RequestMapping("/{pageName}.js")
    public ModelAndView getJsPage(
            @PathVariable("pageName") String pageName,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {

        response.setContentType("text/javascript; charset=utf-8");

        ModelAndView mav = new ModelAndView(pageName + ".js");
        mav.addObject("proxy_host", proxy_host);

        return mav;
    }

    @RequestMapping("/error.html")
    public ModelAndView ErrorPageHandler(HttpServletRequest request, HttpServletResponse response) throws Exception {

        response.setContentType("text/html; charset=utf-8");
        ModelAndView mav = new ModelAndView("error.html");

        return mav;
    }
}
