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
import org.springframework.web.bind.annotation.RequestParam;
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
    public ModelAndView indexHtml(HttpServletResponse response) throws Exception {
        return getHtmlPage("index.html", response);
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
            @RequestParam(value = "vm_metsId", required = true) String vm_metsId,
            @RequestParam(value = "vm_widgetLite", required = false, defaultValue = "true") String vm_widgetLite,
            @RequestParam(value = "vm_default_thumbnailpage", required = false, defaultValue = "1") String vm_default_thumbnailpage,
            @RequestParam(value = "vm_width", required = false, defaultValue = "1024") String vm_width,
            @RequestParam(value = "vm_height", required = false, defaultValue = "600") String vm_height,
            @RequestParam(value = "vm_startpage", required = false, defaultValue = "0") String vm_startpage,
            @RequestParam(value = "vm_number_of_thumbnails_in_overview", required = false, defaultValue = "20") String vm_number_of_thumbnails_in_overview,
            @RequestParam(value = "vm_hide_full_screen_button", required = false, defaultValue = "1") String vm_hide_full_screen_button,
            @RequestParam(value = "vm_disable_transcription_button", required = false, defaultValue = "1") String vm_disable_transcription_button,
            @RequestParam(value = "vm_title", required = false, defaultValue = "") String vm_title,
            HttpServletResponse response
    ) throws Exception {

        response.setContentType("text/html; charset=utf-8");

        ModelAndView mav = new ModelAndView("popup.html");
        // Can we make a map of the RequestParam with their defaults ?
        mav.addObject("vm_metsId", vm_metsId);
        mav.addObject("vm_widgetLite", vm_widgetLite);
        mav.addObject("vm_default_thumbnailpage", vm_default_thumbnailpage);
        mav.addObject("vm_width", vm_width);
        mav.addObject("vm_height", vm_height);
        mav.addObject("vm_startpage", vm_startpage);
        mav.addObject("vm_number_of_thumbnails_in_overview", vm_number_of_thumbnails_in_overview);
        mav.addObject("vm_hide_full_screen_button", vm_hide_full_screen_button);
        mav.addObject("vm_disable_transcription_button", vm_disable_transcription_button);
        mav.addObject("vm_title", vm_title);
        mav.addObject("proxy_host", proxy_host);

        return mav;
    }

    @RequestMapping("/{pageName}.html")
    public ModelAndView getHtmlPage(
            @PathVariable("pageName") String pageName,
            HttpServletResponse response
    ) throws Exception {

        response.setContentType("text/html; charset=utf-8");

        ModelAndView mav = new ModelAndView(pageName + ".html");

        return mav;
    }

    @RequestMapping("/{pageName}.js")
    public ModelAndView getJsPage(
            @PathVariable("pageName") String pageName,
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
