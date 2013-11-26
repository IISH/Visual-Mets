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

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.iish.visualmets.dao.DocumentDao;
import org.iish.visualmets.datamodels.ImageItem;
import org.iish.visualmets.datamodels.PagerItem;
import org.iish.visualmets.services.ImageTransformation;
import org.iish.visualmets.services.MyService;
import org.iish.visualmets.util.ControllerUtils;
import org.iish.visualmets.util.VisualMetsProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;


@Controller
public class ControllerDocument {

    private static final String REFERENCE_IMAGE = "hires reference image";

    @Autowired
	private VisualMetsProperties visualMetsProperties;

	@Autowired
	private ImageTransformation imageTransformation;

	@Autowired
	private MyService myService;


	@Value("#{visualmetsProperties['client.pager.rows.max']}")
	private int client_pager_rows_max = 20;


	@Qualifier("documentDao")
	@Autowired
	private DocumentDao dao;

	@RequestMapping(value = "/document", method = RequestMethod.GET)
	public ModelAndView getDocument(
			@RequestParam(value = "eadId", required = false, defaultValue = "") String eadId,
			@RequestParam(value = "metsId", required = true) String metsId,
			@RequestParam(value = "defaults", required = false, defaultValue = "false") Boolean defaults,
			@RequestParam(value = "scale", required = false, defaultValue = "false") Boolean scale,
			@RequestParam(value = "scale.width", required = false, defaultValue = "800") int scaleWidth,
			@RequestParam(value = "scale.height", required = false, defaultValue = "600") int scaleHeight,
			@RequestParam(value = "scale.pageId", required = false, defaultValue = "1") int pageId,
			@RequestParam(value = "pager", required = false, defaultValue = "false") Boolean pager,
			@RequestParam(value = "pager.start", required = false, defaultValue = "1") int pagerStart,
			@RequestParam(value = "pager.rows", required = false, defaultValue = "20") int pagerRows,
			@RequestParam(value = "callback", required = false) String callback,
			@RequestParam(value = "fileGrp", required = false, defaultValue = "thumbnail image") String fileGrp,
			HttpServletResponse response) throws Exception, IOException {
//        @RequestParam(value = "eadId", required = true) String eadId,


		Map map = myService.extract(metsId);
		//System.out.println(map);




		// + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

		// check if the given fileGrp is allowed
		String[] allowedFileGrps = {"archive image", "hires reference image", REFERENCE_IMAGE, "thumbnail image", "reference"};
		if (!Arrays.asList(allowedFileGrps).contains(fileGrp)) {
			fileGrp = REFERENCE_IMAGE;
		}

		// + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
		//callback="json-On";

		ModelAndView mav = ControllerUtils.createModelAndViewPage("document", callback, response);

		// Now collect the resources and defaults
		if (defaults) {
			Map dfts = visualMetsProperties.getClientResources();
			mav.addObject("defaults", dfts);
		}



		mav.addObject("eadId", eadId);
		mav.addObject("pdfUrl", "");
		mav.addObject("message", "");
		mav.addObject("metsId", metsId);
		mav.addObject("pageId", pageId);
		mav.addObject("breadcrumb", map.get(MyService.KEY_BREADCRUMB));
		mav.addObject("breadcrumbUrls", myService.generateBreadcrumbUrls((String)map.get(MyService.KEY_ARCHIVE),(String)map.get(MyService.KEY_NUMBER)));
		mav.addObject("note", map.get(MyService.KEY_NOTE));

		/*String ocrUrl="";
		boolean hasOcr=true;

		try{
			ImageItem ocrInfo = getImageInfo(eadId, metsId, pageId, "ocr");
			ocrUrl=ocrInfo.getUrl();
		}
		catch(Exception e)
		{
			hasOcr=false;
		}

		mav.addObject("ocrUrl", map.get(MyService.KEY_NOTE));*/

		//String pdfUrl=proxy_host_mets + "rest/resource/get_pdf?metsId=" + metsId;


		int code = (Integer) map.get(MyService.KEY_CODE);
		mav.addObject("code", code);
		String message = (String) map.get(MyService.KEY_MESSAGE);
		if(message != null)
			mav.addObject("message", message);

		if (code == HttpServletResponse.SC_OK) {
			mav.addObject("pdfUrl", myService.generatePdfUrl(metsId));

			// The pager
			if (pager) {
				/*pagerRows = (pagerRows > client_pager_rows_max)
						? client_pager_rows_max
						: pagerRows;*/



				if (pagerStart < 1)
					pagerStart = 1;

//            PagerItem pagerItem = dao.getPager(eadId, metsId, pageId, pagerStart, pagerRows, "thumbnail");
				//PagerItem pagerItem = dao.getPager(eadId, metsId, pageId, pagerStart, pagerRows, fileGrp);
				PagerItem pagerItem = dao.getPager(eadId, metsId, pageId, pagerStart, pagerRows, fileGrp);
				mav.addObject("pager", pagerItem);
			}

			// Scale calculations based on the pageId
			if (scale) {
				// GET ORIGINAL SIZE IMAGE
				// ToDo: first, the controller must be able to accept a USE filesec type.
				// This will be added to the response... here we have a specific image layer... it must be generic.

				// ToDo: remove with the USE parameter, rather than hardcoding over here
				ImageItem imageInfo = getImageInfo(eadId, metsId, pageId, REFERENCE_IMAGE);
				// hack voor dora russel (die returneert reference)
				if (imageInfo == null) {
					imageInfo = getImageInfo(eadId, metsId, pageId, "reference");
				}

				logger.debug("URL: " + imageInfo.getUrl().toString());
				BufferedImage img = ImageIO.read(new URL(imageInfo.getUrl().toString()));
				int scl = imageTransformation.getScale(img.getWidth(), img.getHeight(), scaleWidth, scaleHeight, 100);
				mav.addObject("image_width", img.getWidth());
				mav.addObject("image_height", img.getHeight());
				mav.addObject("canvas_width", scaleWidth);
				mav.addObject("canvas_height", scaleHeight);
				mav.addObject("scale", scl);
			}
		}




		/*mav.addObject("image_width", 100);
		mav.addObject("image_height", 100);
		mav.addObject("canvas_width", 100);
		mav.addObject("canvas_height", 100);

		mav.addObject("scale", 1);*/




			/*mav.addObject("image_width", 0);
			mav.addObject("image_height", 0);
			mav.addObject("canvas_width", 0);
			mav.addObject("canvas_height", 0);

			mav.addObject("scale", 0);*/

		return mav;
	}

	// maak een datamodel van de return waardes ( url, mimetype, use, metsid en fileId ).
	// Dan kun je in de afnemende functies gebruik maken van de getters.
	public ImageItem getImageInfo(String eadId, String metsId, int pageId, String use) throws Exception {

		return dao.getUrl(eadId, metsId, pageId, use);
	}

	@RequestMapping(value = "/documentInfo", method = RequestMethod.GET)
	public ModelAndView getDocumentInfo(
			@RequestParam(value = "metsId", required = true) String metsId,
			@RequestParam(value = "callback", required = false) String callback,
			HttpServletResponse response) throws Exception, IOException {

		ModelAndView mav = ControllerUtils.createModelAndViewPage("documentInfo", callback, response);

		// Now collect the resources and defaults
		Map dfts = visualMetsProperties.getClientResources();
		mav.addObject("defaults", dfts);

		mav.addObject("metsId", metsId);

		// The pager
		PagerItem pagerItem = dao.getPager("", metsId, 1, 1, 9999, REFERENCE_IMAGE);
		mav.addObject("pager", pagerItem);

		return mav;
	}

	@RequestMapping(value = "/pageInfo", method = RequestMethod.GET)
	public ModelAndView getPageInfo(
			@RequestParam(value = "metsId", required = true) String metsId,
			@RequestParam(value = "pageId", required = false, defaultValue = "1") int pageId,
			@RequestParam(value = "callback", required = false) String callback,
			HttpServletResponse response) throws Exception {

		ModelAndView mav = ControllerUtils.createModelAndViewPage("pageInfo", callback, response);

		// Now collect the resources and defaults
		Map dfts = visualMetsProperties.getClientResources();
		mav.addObject("defaults", dfts);

		mav.addObject("metsId", metsId);
		mav.addObject("pageId", pageId);

		// The pager
		PagerItem pagerItem = dao.getPagerPageInfo("", metsId, pageId, pageId, 1, REFERENCE_IMAGE);
		mav.addObject("pager", pagerItem);

		return mav;
	}

	protected final Log logger = LogFactory.getLog(getClass());
}
