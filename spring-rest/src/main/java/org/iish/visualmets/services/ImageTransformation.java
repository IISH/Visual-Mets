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

import org.springframework.beans.factory.annotation.Value;

import java.awt.*;
import java.awt.geom.AffineTransform;
import java.awt.image.AffineTransformOp;
import java.awt.image.BufferedImage;
import java.awt.image.RasterFormatException;
import java.awt.image.RescaleOp;
import java.io.IOException;
import java.util.ArrayList;
import java.util.regex.Pattern;

import static java.lang.Integer.*;

/*
* Created by IntelliJ IDEA.
* Date: 15-nov-2010
* Time: 11:42:21
*
* @author: Lucien van Wouw <lwo@iisg.nl>
*/

public class ImageTransformation {

    private ArrayList<Integer> allowed_rotation;

    public ImageTransformation() {
        allowed_rotation = new ArrayList<Integer>();
        allowed_rotation.add(0);
        allowed_rotation.add(90);
        allowed_rotation.add(180);
        allowed_rotation.add(270);
    }

    // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
    // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

    /**
     * Returns a scaled BufferedImage
     *
     * @param bi        current image
     * @param maxWidth  new width
     * @param maxHeight new height
     * @return a new/scaled image
     */

	/*public static BufferedImage ScaleImage(BufferedImage image, int width, int height) throws IOException {
		int imageWidth  = image.getWidth();
		int imageHeight = image.getHeight();

		double scaleX = (double)width/imageWidth;
		double scaleY = (double)height/imageHeight;
		AffineTransform scaleTransform = AffineTransform.getScaleInstance(scaleX, scaleY);
		AffineTransformOp bilinearScaleOp = new AffineTransformOp(scaleTransform, AffineTransformOp.TYPE_BILINEAR);

		return bilinearScaleOp.filter(
				image,
				new BufferedImage(width, height, image.getType()));
	}*/

    public BufferedImage ScaleImage(BufferedImage bi, int maxWidth, int maxHeight) {
        double originalWidth = bi.getWidth() * 1.0;
        double originalHeight = bi.getHeight() * 1.0;

        double widthRatio = (maxWidth * 1.0) / originalWidth;
        double heightRatio = (maxHeight * 1.0) / originalHeight;
        double newImageRatio = 0;
        if (widthRatio < heightRatio) {
            newImageRatio = widthRatio;
        } else {
            newImageRatio = heightRatio;
        }

        BufferedImage bdest = new BufferedImage((int) (originalWidth * newImageRatio), (int) (originalHeight * newImageRatio), BufferedImage.TYPE_INT_RGB);
        Graphics2D g = bdest.createGraphics();
        AffineTransform at = AffineTransform.getScaleInstance(newImageRatio, newImageRatio);
        g.drawRenderedImage(bi, at);

        return bdest;
    }

    // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
    // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

    public BufferedImage CropImage(BufferedImage img, String crop) {
        BufferedImage clipped = null;
        boolean coordinates_okay = false;

        if (!crop.trim().equals("")) {
            coordinates_okay = true;

            int[] coordinates = {0, 0, img.getWidth(), img.getHeight()};

            // split crop value in parts
            String[] crop_coordinates = crop.split(",");

            // if still okay, check if each part is a integer
            if (coordinates_okay) {
                for (int i = 0; i < crop_coordinates.length && i < 4; i++) {
                    if (!crop_coordinates[i].trim().equals("")) {
                        if (!Pattern.matches("^-?\\d*$", crop_coordinates[i].trim())) {
                            coordinates_okay = false;
                        } else {
                            coordinates[i] = parseInt(crop_coordinates[i].trim());
                        }
                    }
                }
            }

            // als coordinaten negatief, dan vanuit gaan dat het van de 'andere' kant is
            if (coordinates_okay) {
                if (coordinates[0] < 0) {
                    coordinates[0] = img.getWidth() + coordinates[0];
                }

                if (coordinates[1] < 0) {
                    coordinates[1] = img.getHeight() + coordinates[1];
                }

                if (coordinates[2] < 0) {
                    coordinates[2] = img.getWidth() + coordinates[2];
                }

                if (coordinates[3] < 0) {
                    coordinates[3] = img.getHeight() + coordinates[3];
                }
            }

            // alle coordinaten moeten op dit moment positieve getallen binnen de image grootte/breedte zijn
            if (coordinates_okay) {
                if (coordinates[0] > img.getWidth() || coordinates[0] < 0) {
                    coordinates_okay = false;
                }

                if (coordinates[1] > img.getHeight() || coordinates[1] < 0) {
                    coordinates_okay = false;
                }

                if (coordinates[2] > img.getWidth() || coordinates[2] < 0) {
                    coordinates_okay = false;
                }

                if (coordinates[3] > img.getHeight() || coordinates[3] < 0) {
                    coordinates_okay = false;
                }
            }

            // controleer of de linker/boven waarde kleiner is dan de rechter/onder coordinaat
            if (coordinates_okay) {
                if (coordinates[0] >= coordinates[2]) {
                    coordinates_okay = false;
                }
                if (coordinates[1] >= coordinates[3]) {
                    coordinates_okay = false;
                }
            }

            if (coordinates_okay) {
                // if still okay, then get cropped image
                try {
                    int w = coordinates[2] - coordinates[0];
                    int h = coordinates[3] - coordinates[1];

                    clipped = img.getSubimage(coordinates[0], coordinates[1], w, h);
                }
                catch (RasterFormatException rfe) {
                    System.out.println("raster format error: " + rfe.getMessage());
                    coordinates_okay = false;
                }
            }
        }

        if (!coordinates_okay) {
            clipped = img;
        }

        return clipped;
    }

    // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
    // + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +

    /**
     * Returns a 90 degrees rotated image
     *
     * @param bi image
     * @return a rotated image
     */
    private BufferedImage RotateImage90Degrees(BufferedImage bi) {
        int width = bi.getWidth();
        int height = bi.getHeight();

        BufferedImage biFlip = new BufferedImage(height, width, bi.getType());

        for (int i = 0; i < width; i++)
            for (int j = 0; j < height; j++) {
                biFlip.setRGB(height - 1 - j, i, bi.getRGB(i, j));
            }

        return biFlip;
    }

    /**
     * Returns a 180 degrees rotated image
     *
     * @param bi image
     * @return a rotated image
     */
    private BufferedImage RotateImage180Degrees(BufferedImage bi) {
        int width = bi.getWidth();
        int height = bi.getHeight();

        BufferedImage biFlip = new BufferedImage(width, height, bi.getType());

        for (int i = 0; i < width; i++)
            for (int j = 0; j < height; j++) {
                biFlip.setRGB(width - 1 - i, height - 1 - j, bi.getRGB(i, j));
            }

        return biFlip;
    }

    /**
     * Returns a 270 degrees rotated image
     *
     * @param bi image
     * @return a rotated image
     */
    private BufferedImage RotateImage270Degrees(BufferedImage bi) {
        int width = bi.getWidth();
        int height = bi.getHeight();

        BufferedImage biFlip = new BufferedImage(height, width, bi.getType());

        for (int i = 0; i < width; i++)
            for (int j = 0; j < height; j++) {
                biFlip.setRGB(j, width - 1 - i, bi.getRGB(i, j));
            }

        return biFlip;
    }

    public BufferedImage RotateImage90DegreesStepsOnly(BufferedImage img, int angle) {

        // graden boven 360 hebben geen nut, verlaag tot onder 360
        angle = angle % 360;

        // voor roteren 'moet' een positieve waarde opgegeven worden
        if (angle < 0) {
            angle = angle + 360;
        }

        // controleer of rotatie 1 van de toegestane rotaties is
        if (!allowed_rotation.contains(angle)) {
            angle = 0;
        }

        switch (angle) {
            case 90:
                img = RotateImage90Degrees(img); // naar rechts
                break;
            case 180:
                img = RotateImage180Degrees(img); // 180 graden
                break;
            case 270:
                img = RotateImage270Degrees(img); // naar links
                break;
        }

        return img;
    }

    public BufferedImage ContrastBrightnessImage(BufferedImage img, float contrast, float brightness) {
        // BRIGHTNESS / CONTRAST
        // scale factor (contrast) (bv. 0 - zwart, 1 - default, 5 - heel licht)
        // offset (brightness) (bv. -100, -90, ..., -20, -10, 0, 10, 20, 90, 100)

        if (contrast != 1f || brightness != 0f) {
            RescaleOp rescaleOp = new RescaleOp(contrast, brightness, null);
            rescaleOp.filter(img, img);
        }

        return img;
    }

    /*
                            Calculate the scale based on the width and height of the client's
                            canvas vis-a-vis the given reference image size.
    */
//    public int getScale(String pageId, int canvas_width, int canvas_height) {
    public int getScale(int current_width, int current_height, float canvas_width, float canvas_height, int max_scale) {
        int scale = 0;

        int scale_width = (int)(canvas_width*100.0/current_width);
        int scale_height = (int)(canvas_height*100.0/current_height);

        if ( scale_width < scale_height) {
            scale = scale_width;
        } else {
            scale = scale_height;
        }

        if ( scale > max_scale ) {
            scale = max_scale;
        }

        return scale;
    }
}
