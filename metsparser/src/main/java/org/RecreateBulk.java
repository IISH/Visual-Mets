package org;

import au.edu.apsr.mtk.base.*;
import au.edu.apsr.mtk.ch.METSReader;
import org.apache.commons.io.FileExistsException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

/**
 * RecreateBulk
 * <p/>
 * Read from a mets document and thus recreate the file & folder structure
 */
final public class RecreateBulk {

    private Log logger = LogFactory.getLog(RecreateBulk.class);

    private static final String FOLDER_TYPE = "folder";
    private static final String FILE_TYPE = "file";
    private static final String DC_TYPE = "dc";
    private static final String CONTENT_TYPE = "content";
    private File parent;
    private String metsFile;
    private METSWrapper wrapper;
    private String accessToken;

    public RecreateBulk(String metsFile, String targetFolder, String accessToken) throws IOException, SAXException, ParserConfigurationException, METSException {
        setMetsFile(metsFile);
        setParent(targetFolder);
        setAccessToken(accessToken);
        final METSReader reader = new METSReader();
        reader.mapToDOM(new FileInputStream(getMetsFile()));
        wrapper = new METSWrapper(reader.getMETSDocument());
    }

    public void recreate() throws METSException, IOException {
        final StructMap physical = wrapper.getMETSObject().getStructMap("physical");
        divs(physical.getDivs(), parent);
    }

    private void divs(final List<Div> divs, final File folder) throws METSException, IOException {
        for (final Div div : divs) {

            if (div.getType().equals(FOLDER_TYPE)) {
                final BulkFile file = getFolder(div);
                file.setPath(folder.getAbsolutePath());
                logger.info("Write folder: " + file.getPath());
                BulkFile.writeFolder(file);
                divs(div.getDivs(), new File(folder, file.getTitle()));
            } else if (div.getType().equals(FILE_TYPE)) {
                final BulkFile file = getFile(div);
                file.setPath(folder.getAbsolutePath());
                logger.info("Write file: " + file.getPath());
                BulkFile.writeFile(file, accessToken);
            }
        }
    }

    private BulkFile getFolder(Div div) throws METSException {

        final List<Div> dc = div.getDivs(DC_TYPE);
        return getBulkFile(dc.get(0));
    }

    private BulkFile getFile(Div div) throws METSException {
        final List<Div> dc = div.getDivs(DC_TYPE);
        final BulkFile bulkFile = getBulkFile(dc.get(0));

        final List<Div> content = div.getDivs(CONTENT_TYPE);
        au.edu.apsr.mtk.base.File file = getFileFromFileGroup(content.get(0));
        final FLocat fLocats = file.getFLocats().get(0);
        bulkFile.setChecksum(file.getChecksum()) ;
        bulkFile.setLength(file.getSize()) ;
        bulkFile.setHref(fLocats.getHref()) ;
        return bulkFile;
    }


    private BulkFile getBulkFile(Div div) throws METSException {
        au.edu.apsr.mtk.base.File file = getFileFromFileGroup(div);

        Node xmlData = file.getXMLData();
        final BulkFile bulkFile = new BulkFile();

        do {
            if (xmlData.getLocalName().equalsIgnoreCase("title")) {
                bulkFile.setTitle(xmlData.getTextContent());
            } else if (xmlData.getLocalName().equalsIgnoreCase("created")) {
                bulkFile.setCreated(xmlData.getTextContent());
            } else if (xmlData.getLocalName().equalsIgnoreCase("accessRights")) {
                bulkFile.setAccessRights(xmlData.getTextContent());
            }
            xmlData = xmlData.getNextSibling();
        } while (xmlData != null);

        return bulkFile;
    }

    private au.edu.apsr.mtk.base.File getFileFromFileGroup(Div div) throws METSException {
        final Fptr fptr = div.getFptrs().get(0);
        final String fileID = fptr.getFileID();
        return wrapper.getMETSObject().getFileSec().getFile(fileID);
    }


    public void setParent(String parent) throws FileExistsException {
        this.parent = new File(parent);
        if (this.parent.exists())
            throw new FileExistsException(parent);
    }

    public String getMetsFile() {
        return metsFile;
    }

    public void setMetsFile(String metsFile) {
        this.metsFile = metsFile;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
}
