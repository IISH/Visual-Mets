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

import org.iish.visualmets.dao.DocumentDao;
import org.iish.visualmets.datamodels.ImageItem;
import org.iish.visualmets.services.CacheService;
import org.iish.visualmets.services.ImageTransformation;
import org.iish.visualmets.services.MyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Arrays;

@Controller
public class ControllerResource {

    private static final String REFERENCE_IMAGE = "hires reference image";

    @Autowired
    private ImageTransformation imageTransformation;

    @Autowired
    public CacheService cacheService;

    @Qualifier("documentDao")
    @Autowired
    private DocumentDao dao;

	@Autowired
	private MyService myService;

    @Value("#{visualmetsProperties['client.reference_image.padding.min']}")
    private int image_padding_min = 0;
    @Value("#{visualmetsProperties['client.reference_image.padding.max']}")
    private int image_padding_max = 50;
    @Value("#{visualmetsProperties['client.reference_image.zoom.min']}")
    private int image_zoom_min = 10;
    @Value("#{visualmetsProperties['client.reference_image.zoom.max']}")
    private int image_zoom_max = 400;

	@RequestMapping(value = "/resource/get_pdf", method = RequestMethod.GET)
	public void getPdf(
			@RequestParam(value = "eadId", required = false, defaultValue = "") String eadId,
			@RequestParam(value = "metsId", required = true) String metsId,
			@RequestParam(value = "selection", required = false) String selection,
			@RequestParam(value = "pageId", required = false, defaultValue = "1") int pageId,
			HttpServletResponse response
	)
			throws Exception, IOException {

		byte[] bytes= myService.createPdf(metsId,selection);


		response.setContentType("application/pdf; utf-8");
		response.setHeader("content-disposition", "inline; filename=\"balbla.pdf\"");
		response.getOutputStream().write(bytes);
	}


	/**
     * Returns a thumbnail image
     *
     * @param eadId  ead ID
     * @param metsId mets ID
     * @param pageId show which page
     * @param width  max. width of the thumbnail
     * @param height max. height of the thumbnail
     */
    @RequestMapping(value = "/resource/thumbnail_image", method = RequestMethod.GET)
    public void getThumbnailImage(

            @RequestParam(value = "metsId", required = true) String metsId,
            @RequestParam(value = "eadId", required = false, defaultValue = "") String eadId,
            @RequestParam(value = "pageId", required = false, defaultValue = "1") int pageId,
            @RequestParam(value = "angle", required = false, defaultValue = "0") Integer angle,
            @RequestParam(value = "width", required = false, defaultValue = "160") float width,
            @RequestParam(value = "height", required = false, defaultValue = "160") float height,
            @RequestParam(value = "padding", required = false, defaultValue = "0") Integer padding,
            @RequestParam(value = "zoom", required = false, defaultValue = "100") Integer zoom,
            @RequestParam(value = "brightness", required = false, defaultValue = "0f") float brightness,
            @RequestParam(value = "contrast", required = false, defaultValue = "1f") float contrast,
            @RequestParam(value = "crop", required = false, defaultValue = "") String crop,
            @RequestParam(value = "callback", required = false) String callback,
            HttpServletResponse response
    )
            throws Exception, IOException {

//        @RequestParam(value = "eadId", required = true) String eadId,

        // DEZE ONDERDELEN MOETEN NOG GEMAAKT WORDEN
        // - left
        // - top

        // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

        // GET ORIGINAL SIZE IMAGE
        ImageItem imageInfo = getImageInfo(eadId, metsId, pageId, "thumbnail image");
        BufferedImage img =  cacheService.loadImage(imageInfo.getUrl()) ;

        // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

        // check min en max values for PADDING and ZOOM
        padding = checkMinMaxValue(padding, image_padding_min, image_padding_max);
        zoom = checkMinMaxValue(zoom, image_zoom_min, image_zoom_max);

        // RESCALE IMAGE
        double scaleWidth = width * zoom / 100;
        double scaleHeight = height * zoom / 100;
        img = imageTransformation.ScaleImage(img, (int) scaleWidth - (2 * padding), (int) scaleHeight - (2 * padding));

        // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

        // BRIGHTNESS / CONTRAST
        // scale factor (contrast) (bv. 0 - zwart, 1 - default, 5 - heel licht)
        // offset (brightness) (bv. -100, -90, ..., -20, -10, 0, 10, 20, 90, 100)
        img = imageTransformation.ContrastBrightnessImage(img, contrast, brightness);

        // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

        // CROP IMAGE
        img = imageTransformation.CropImage(img, crop.trim());

        // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

        // ROTATE IMAGE
        img = imageTransformation.RotateImage90DegreesStepsOnly(img, angle);

        // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

        // send to browser
        response.setContentType("image/jpeg");
        ImageIO.write(img, "jpg", response.getOutputStream());
    }


    /**
     * Returns a reference image
     *
     * @param eadId      ead ID
     * @param metsId     mets ID
     * @param pageId     show which page
     * @param scale      scale
     * @param angle      angle/rotation
     * @param brightness brightness
     * @param contrast   contrast
     * @param callback   callback
     */

//    * @param width         max. width of the thumbnail
//    * @param height        max. height of the thumbnail
//    * @param padding       how much padding left, right, top, bottom
//    * @param zoom          zoom level
//    * @param crop          contrast
    @RequestMapping(value = "/resource/reference_image", method = RequestMethod.GET)
    public void getReferenceImage(
            @RequestParam(value = "eadId", required = false, defaultValue = "") String eadId,
            @RequestParam(value = "metsId", required = true) String metsId,
            @RequestParam(value = "pageId", required = false, defaultValue = "1") int pageId,
            @RequestParam(value = "scale", required = false, defaultValue = "100") Integer scale,
            @RequestParam(value = "angle", required = false, defaultValue = "0") Integer angle,
            @RequestParam(value = "brightness", required = false, defaultValue = "0f") float brightness,
            @RequestParam(value = "contrast", required = false, defaultValue = "1f") float contrast,
            @RequestParam(value = "width", required = false, defaultValue = "0") Integer width,
            @RequestParam(value = "height", required = false, defaultValue = "0") Integer height,
            @RequestParam(value = "callback", required = false) String callback,
            @RequestParam(value = "fileGrp", required = false, defaultValue = REFERENCE_IMAGE) String fileGrp,
            HttpServletResponse response
    )
            throws Exception, IOException {
//         @RequestParam(value = "eadId", required = true) String eadId,
//        @RequestParam(value = "width", required = false, defaultValue = "400") Integer width,
//        @RequestParam(value = "height", required = false, defaultValue = "400") Integer height,
//        @RequestParam(value = "padding", required = false, defaultValue = "0") Integer padding,
//        @RequestParam(value = "zoom", required = false, defaultValue = "100") Integer zoom,
//        @RequestParam(value = "crop", required = false, defaultValue = "") String crop,

        // DEZE ONDERDELEN MOETEN NOG GEMAAKT WORDEN
        // - left
        // - top

        // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

        // check if the given fileGrp is allowed
        String[] allowedFileGrps = {"archive image", "hires reference image", REFERENCE_IMAGE, "thumbnail image", "reference image"};
        if (!Arrays.asList(allowedFileGrps).contains(fileGrp)) {
            fileGrp = REFERENCE_IMAGE;
        }

        // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

        // GET ORIGINAL SIZE IMAGE
        // ToDo: fix reference, reference image, thumbnail image problem
        ImageItem imageInfo = null;
        //imageInfo = getImageInfo(eadId, metsId, pageId, "reference image");
        imageInfo = getImageInfo(eadId, metsId, pageId, fileGrp);
        // hack voor dora russel (die returneert reference)
        if (imageInfo == null) {
            imageInfo = getImageInfo(eadId, metsId, pageId, "reference");
        }
        BufferedImage img =  cacheService.loadImage ( imageInfo.getUrl() ) ;

        // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

        // RESCALE IMAGE
        // indien er geen scale is, maar wel een width en height is opgegeven, retourneer dan in opgegeven maten
        if ((int) scale == 0 && width > 0 && height > 0) {
            // plaatje dat exact past in opgegeven vlak
            img = imageTransformation.ScaleImage(img, width, height);
        } else {
            // scale plaatje
            img = imageTransformation.ScaleImage(img, (int) scale * img.getWidth() / 100, (int) scale * img.getHeight() / 100);
        }


        // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

        // BRIGHTNESS / CONTRAST
        // scale factor (contrast) (bv. 0 - zwart, 1 - default, 5 - heel licht)
        // offset (brightness) (bv. -100, -90, ..., -20, -10, 0, 10, 20, 90, 100)
        img = imageTransformation.ContrastBrightnessImage(img, contrast, brightness);

        // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

        // ROTATE IMAGE
        img = imageTransformation.RotateImage90DegreesStepsOnly(img, angle);

        // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

        // send to browser
        response.setContentType("image/jpeg");
        ImageIO.write(img, "jpg", response.getOutputStream());
    }


    @RequestMapping(value = "/resource/get_transcription", method = RequestMethod.GET)
    public void getTranscription(
            @RequestParam(value = "eadId", required = false, defaultValue = "") String eadId,
            @RequestParam(value = "metsId", required = true) String metsId,
            @RequestParam(value = "pageId", required = false, defaultValue = "1") int pageId,
            @RequestParam(value = "callback", required = false) String callback,
            HttpServletResponse response
    )
            throws Exception, IOException {

        ImageItem imageInfoOcr = getImageInfo(eadId, metsId, pageId, "ocr");
        ImageItem imageInfoTranscription = getImageInfo(eadId, metsId, pageId, "transcription plain text");

		//callback="dummy";

        String transcription = "";

        if ((imageInfoOcr != null) || (imageInfoTranscription != null)) {
            String filename = (imageInfoOcr != null) ? imageInfoOcr.getUrl() : imageInfoTranscription.getUrl();

            // TODOx: READ FILE SOURCE
            try {
                URL u = new URL(filename);
                boolean dataAdded = false;
                BufferedReader in = new BufferedReader(new InputStreamReader(u.openStream()));
//                    BufferedReader in = new BufferedReader(	new InputStreamReader( u.openStream(), "UTF-8" ) );
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    dataAdded = true;
                    transcription = transcription + inputLine + "<br>";
                }
                in.close();
                if (!dataAdded) {
//                        transcription += "-no transcription-";
                }
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        if (transcription.equals("")) {
            /*transcription += "-no transcription-";*/
        }
        // add json tags
        transcription = callback + "({\n\t\"transcription\":\"" + StringUtils.replace(transcription, "'", "\'") + "\"\n})";

        response.setContentType("text/plain; utf-8");
        response.getOutputStream().print(transcription);
    }

    public int checkMinMaxValue(int value, int minValue, int maxValue) {
        if (value < minValue) {
            value = minValue;
        } else if (value > maxValue) {
            value = maxValue;
        }

        return value;
    }

    // maak een datamodel van de return waardes ( url, mimetype, use, metsid en fileId ).
    // Dan kun je in de afnemende functies gebruik maken van de getters.
    public ImageItem getImageInfo(String eadId, String metsId, int pageId, String use) throws Exception {
        return dao.getUrl(eadId, metsId, pageId, use);
    }
}