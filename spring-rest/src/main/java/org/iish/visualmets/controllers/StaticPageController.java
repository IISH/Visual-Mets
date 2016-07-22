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

import org.iish.visualmets.util.ControllerUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/*
* StaticPageController
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
    public ModelAndView indexHtml(HttpServletResponse response) throws Exception {
        return getHtmlPage("index", response);
    }

    /**
     * Received the values needed for building an html page that calls the widget.
     *
     * @param response
     * @return
     * @throws Exception
     */
    @RequestMapping("/popup.html")
    public ModelAndView getPopupPage(
            @RequestParam(value = "metsId", required = true) String metsId,
            @RequestParam(value = "widgetLite", required = false, defaultValue = "true") String widgetLite,
            @RequestParam(value = "default_thumbnailpage", required = false, defaultValue = "1") String default_thumbnailpage,
            @RequestParam(value = "width", required = false, defaultValue = "1024") String width,
            @RequestParam(value = "height", required = false, defaultValue = "600") String height,
            @RequestParam(value = "startpage", required = false, defaultValue = "0") String startpage,
            @RequestParam(value = "number_of_thumbnails_in_overview", required = false, defaultValue = "20") String number_of_thumbnails_in_overview,
            @RequestParam(value = "hide_full_screen_button", required = false, defaultValue = "1") String hide_full_screen_button,
            @RequestParam(value = "disable_transcription_button", required = false, defaultValue = "1") String disable_transcription_button,
            @RequestParam(value = "title", required = false, defaultValue = "") String title,
            HttpServletResponse response
    ) throws Exception {

        response.setContentType("text/html; charset=utf-8");

        ModelAndView mav = new ModelAndView("popup.html");
        // Can we make a map of the RequestParam with their defaults ?
        mav.addObject("metsId", metsId);
        mav.addObject("widgetLite", widgetLite);
        mav.addObject("default_thumbnailpage", default_thumbnailpage);
        mav.addObject("width", width);
        mav.addObject("height", height);
        mav.addObject("startpage", startpage);
        mav.addObject("number_of_thumbnails_in_overview", number_of_thumbnails_in_overview);
        mav.addObject("hide_full_screen_button", hide_full_screen_button);
        mav.addObject("disable_transcription_button", disable_transcription_button);
        mav.addObject("title", title);
        mav.addObject("proxy_host_mets", proxy_host);

        return mav;
    }

    @RequestMapping(value = "/template.handler.html", method = RequestMethod.GET)
    public ModelAndView template(@RequestParam(value = "callback", required = false) String callback, HttpServletResponse response) {
        return ControllerUtils.createModelAndViewPage("template.handler", callback, response);
    }

    @RequestMapping("/{pageName}.html")
    public ModelAndView getHtmlPage(
            @PathVariable("pageName") String pageName,
            HttpServletResponse response
    ) throws Exception {

        response.setContentType("text/html; charset=utf-8");

        return new ModelAndView(pageName + ".html");
    }

    @RequestMapping("/{pageName}.js")
    public ModelAndView getJsPage(
            @PathVariable("pageName") String pageName,
            HttpServletResponse response
    ) throws Exception {

        response.setContentType("text/javascript; charset=utf-8");

        ModelAndView mav = new ModelAndView(pageName + ".js");
        mav.addObject("proxy_host_mets", proxy_host);

        return mav;
    }

    @RequestMapping("/{pageName}.xml")
    public ModelAndView getXmlPage(
            @PathVariable("pageName") String pageName,
            HttpServletResponse response
    ) throws Exception {

        response.setContentType("text/xml; charset=utf-8");

        ModelAndView mav = new ModelAndView(pageName + ".xml");
        mav.addObject("proxy_host_mets", proxy_host);

        return mav;
    }

/*
    @RequestMapping("/{pageName}.jnlp")
    public ModelAndView getJNLP(@PathVariable("pageName") String pageName,
                                @RequestParam(value = "metsId", required = false) String metsId,
                                HttpServletResponse response) {
        response.setContentType("application/x-java-jnlp-file; charset=utf-8");
                                            f
        ModelAndView mav = new ModelAndView(pageName + ".jnlp");
        mav.addObject("metsId", metsId) ;
        mav.addObject("pageName", pageName) ;
        return mav;
    }
*/

    @RequestMapping("/error.html")
    public ModelAndView ErrorPageHandler(HttpServletRequest request, HttpServletResponse response) throws Exception {

        response.setContentType("text/html; charset=utf-8");

        return new ModelAndView("error.html");
    }
}
