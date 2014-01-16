<#--Freemarker template-->
<@compress single_line=true>

<mets xmlns='http://www.loc.gov/METS/' xmlns:xlink='http://www.w3.org/1999/xlink'
      xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'
      xsi:schemaLocation='http://www.loc.gov/METS/ http://www.loc.gov/standards/mets/mets.xsd'
      OBJID='12345/sample'>
    <amdSec ID='admSec-1'>
        <rightsMD ID='rightsMD-1'>
            <mdWrap MDTYPE='OTHER'>
                <xmlData>
                    <epdcx:descriptionSet xmlns:epdcx='http://purl.org/eprint/epdcx/2006-11-16/'
                                          xsi:schemaLocation='http://purl.org/eprint/epdcx/2006-11-16/ http://purl.org/eprint/epdcx/xsd/2006-11-16/epdcx.xsd'>
                        <epdcx:description epdcx:resourceId='master'>
                            <epdcx:statement epdcx:propertyURI='http://purl.org/dc/terms/available'
                                             epdcx:valueRef='http://purl.org/eprint/accessRights/ClosedAccess'></epdcx:statement>
                        </epdcx:description>
                        <epdcx:description epdcx:resourceId='level1'>
                            <epdcx:statement epdcx:propertyURI='http://purl.org/dc/terms/available'
                                             epdcx:valueRef='http://purl.org/eprint/accessRights/OpenAccess'></epdcx:statement>
                        </epdcx:description>
                        <epdcx:description epdcx:resourceId='level2'>
                            <epdcx:statement epdcx:propertyURI='http://purl.org/dc/terms/available'
                                             epdcx:valueRef='http://purl.org/eprint/accessRights/OpenAccess'></epdcx:statement>
                        </epdcx:description>
                        <epdcx:description epdcx:resourceId='level3'>
                            <epdcx:statement epdcx:propertyURI='http://purl.org/dc/terms/available'
                                             epdcx:valueRef='http://purl.org/eprint/accessRights/OpenAccess'></epdcx:statement>
                        </epdcx:description>
                    </epdcx:descriptionSet>
                </xmlData>
            </mdWrap>
        </rightsMD>
    </amdSec>
    <fileSec>
        <fileGrp ID='master' USE='archive image'>
            <file CHECKSUM='5ca5e5ddec89d0e0ed196ee496b4e3db' CHECKSUMTYPE='MD5' CREATED='2013-04-24T26:09:16Z' ID='f1'
                  MIMETYPE='image/jpeg' SIZE='11366428'>
                <FLocat LOCTYPE='HANDLE'
                        xlink:href='${proxy_host_mets}rest/resources/images/f1.jpg'
                        xlink:title='f1.jpg' xlink:type='simple'/>
            </file>
            <file CHECKSUM='88e7eb5d38f7884f9f565ecf2a8bd807' CHECKSUMTYPE='MD5' CREATED='2013-04-24T26:09:28Z' ID='f2'
                  MIMETYPE='image/jpeg' SIZE='21771852'>
                <FLocat LOCTYPE='HANDLE'
                        xlink:href='${proxy_host_mets}rest/resources/images/f2.jpg'
                        xlink:title='f2.jpg' xlink:type='simple'/>
            </file>
        </fileGrp>
        <fileGrp ID='level1' USE='hires reference image'>
            <file CHECKSUM='5ca5e5ddec89d0e0ed196ee496b4e3db' CHECKSUMTYPE='MD5' CREATED='2013-04-24T26:09:16Z' ID='f3'
                  MIMETYPE='image/jpeg' SIZE='11366428'>
                <FLocat LOCTYPE='HANDLE'
                        xlink:href='${proxy_host_mets}rest/resources/images/f3.jpg'
                        xlink:title='f3.jpg' xlink:type='simple'/>
            </file>
            <file CHECKSUM='88e7eb5d38f7884f9f565ecf2a8bd807' CHECKSUMTYPE='MD5' CREATED='2013-04-24T26:09:28Z' ID='f4'
                  MIMETYPE='image/jpeg' SIZE='21771852'>
                <FLocat LOCTYPE='HANDLE'
                        xlink:href='${proxy_host_mets}rest/resources/images/f4.jpg'
                        xlink:title='f4.jpg' xlink:type='simple'/>
            </file>
        </fileGrp>
        <fileGrp ID='level2' USE='reference image'>
            <file CHECKSUM='5ca5e5ddec89d0e0ed196ee496b4e3db' CHECKSUMTYPE='MD5' CREATED='2013-04-24T26:09:16Z' ID='f5'
                  MIMETYPE='image/jpeg' SIZE='11366428'>
                <FLocat LOCTYPE='HANDLE'
                        xlink:href='${proxy_host_mets}rest/resources/images/f5.jpg'
                        xlink:title='f5.jpg' xlink:type='simple'/>
            </file>
            <file CHECKSUM='88e7eb5d38f7884f9f565ecf2a8bd807' CHECKSUMTYPE='MD5' CREATED='2013-04-24T26:09:28Z' ID='f6'
                  MIMETYPE='image/jpeg' SIZE='21771852'>
                <FLocat LOCTYPE='HANDLE'
                        xlink:href='${proxy_host_mets}rest/resources/images/f6.jpg'
                        xlink:title='f6.jpg' xlink:type='simple'/>
            </file>
        </fileGrp>
        <fileGrp ID='level3' USE='thumbnail image'>
            <file CHECKSUM='5ca5e5ddec89d0e0ed196ee496b4e3db' CHECKSUMTYPE='MD5' CREATED='2013-04-24T26:09:16Z' ID='f7'
                  MIMETYPE='image/jpeg' SIZE='11366428'>
                <FLocat LOCTYPE='HANDLE'
                        xlink:href='${proxy_host_mets}rest/resources/images/f7.jpg'
                        xlink:title='f7.jpg' xlink:type='simple'/>
            </file>
            <file CHECKSUM='88e7eb5d38f7884f9f565ecf2a8bd807' CHECKSUMTYPE='MD5' CREATED='2013-04-24T26:09:28Z' ID='f8'
                  MIMETYPE='image/jpeg' SIZE='21771852'>
                <FLocat LOCTYPE='HANDLE'
                        xlink:href='${proxy_host_mets}rest/resources/images/f8.jpg'
                        xlink:title='f8.jpg' xlink:type='simple'/>
            </file>
        </fileGrp>
    </fileSec>
    <structMap TYPE='physical'>
        <div>
            <div ID='g0' LABEL='Page 1' ORDER='1' TYPE='page'>
                <fptr FILEID='f1'/>
                <fptr FILEID='f3'/>
                <fptr FILEID='f5'/>
                <fptr FILEID='f7'/>
            </div>
            <div ID='g1' LABEL='Page 2' ORDER='2' TYPE='page'>
                <fptr FILEID='f2'/>
                <fptr FILEID='f4'/>
                <fptr FILEID='f6'/>
                <fptr FILEID='f8'/>
            </div>
        </div>
    </structMap>
</mets>

</@compress>