# -*- coding: utf-8 -*-
import zipfile, datetime
from pathlib import Path

def build_pptx(path: Path):
    z = zipfile.ZipFile(path, mode='w', compression=zipfile.ZIP_DEFLATED)
    add = z.writestr

    add('[Content_Types].xml', """<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<Types xmlns='http://schemas.openxmlformats.org/package/2006/content-types'>
  <Default Extension='rels' ContentType='application/vnd.openxmlformats-package.relationships+xml'/>
  <Default Extension='xml' ContentType='application/xml'/>
  <Override PartName='/ppt/presentation.xml' ContentType='application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml'/>
  <Override PartName='/ppt/slides/slide1.xml' ContentType='application/vnd.openxmlformats-officedocument.presentationml.slide+xml'/>
  <Override PartName='/ppt/slides/slide2.xml' ContentType='application/vnd.openxmlformats-officedocument.presentationml.slide+xml'/>
  <Override PartName='/ppt/slides/slide3.xml' ContentType='application/vnd.openxmlformats-officedocument.presentationml.slide+xml'/>
  <Override PartName='/ppt/slides/slide4.xml' ContentType='application/vnd.openxmlformats-officedocument.presentationml.slide+xml'/>
  <Override PartName='/ppt/slides/slide5.xml' ContentType='application/vnd.openxmlformats-officedocument.presentationml.slide+xml'/>
  <Override PartName='/ppt/slides/slide6.xml' ContentType='application/vnd.openxmlformats-officedocument.presentationml.slide+xml'/>
  <Override PartName='/ppt/slideLayouts/slideLayout1.xml' ContentType='application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml'/>
  <Override PartName='/ppt/slideMasters/slideMaster1.xml' ContentType='application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml'/>
  <Override PartName='/ppt/theme/theme1.xml' ContentType='application/vnd.openxmlformats-officedocument.theme+xml'/>
  <Override PartName='/docProps/core.xml' ContentType='application/vnd.openxmlformats-package.core-properties+xml'/>
  <Override PartName='/docProps/app.xml' ContentType='application/vnd.openxmlformats-officedocument.extended-properties+xml'/>
</Types>
""")

    add('_rels/.rels', """<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'>
  <Relationship Id='rId1' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument' Target='ppt/presentation.xml'/>
  <Relationship Id='rId2' Type='http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties' Target='docProps/core.xml'/>
  <Relationship Id='rId3' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties' Target='docProps/app.xml'/>
</Relationships>
""")

    now = datetime.datetime.utcnow().isoformat() + 'Z'
    add('docProps/core.xml', f"""<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<cp:coreProperties xmlns:cp='http://schemas.openxmlformats.org/package/2006/metadata/core-properties' xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:dcterms='http://purl.org/dc/terms/' xmlns:dcmitype='http://purl.org/dc/dcmitype/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>
  <dc:title>Abdullah Magdy Elbarrany Portfolio</dc:title>
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type='dcterms:W3CDTF'>{now}</dcterms:created>
  <dcterms:modified xsi:type='dcterms:W3CDTF'>{now}</dcterms:modified>
</cp:coreProperties>
""")

    add('docProps/app.xml', """<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<Properties xmlns='http://schemas.openxmlformats.org/officeDocument/2006/extended-properties' xmlns:vt='http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes'>
  <Application>Microsoft Office PowerPoint</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
  <HeadingPairs>
    <vt:vector size='2' baseType='variant'>
      <vt:variant>
        <vt:lpstr>Slides</vt:lpstr>
      </vt:variant>
      <vt:variant>
        <vt:i4>6</vt:i4>
      </vt:variant>
    </vt:vector>
  </HeadingPairs>
  <TitlesOfParts>
    <vt:vector size='6' baseType='lpstr'>
      <vt:lpstr>Slide 1</vt:lpstr>
      <vt:lpstr>Slide 2</vt:lpstr>
      <vt:lpstr>Slide 3</vt:lpstr>
      <vt:lpstr>Slide 4</vt:lpstr>
      <vt:lpstr>Slide 5</vt:lpstr>
      <vt:lpstr>Slide 6</vt:lpstr>
    </vt:vector>
  </TitlesOfParts>
  <Company></Company>
  <LinksUpToDate>false</LinksUpToDate>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>16.0000</AppVersion>
</Properties>
""")

    add('ppt/presentation.xml', """<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<p:presentation xmlns:p='http://schemas.openxmlformats.org/presentationml/2006/main' xmlns:a='http://schemas.openxmlformats.org/drawingml/2006/main' xmlns:r='http://schemas.openxmlformats.org/officeDocument/2006/relationships'>
  <p:sldMasterIdLst>
    <p:sldMasterId id='2147483648' r:id='rId1'/>
  </p:sldMasterIdLst>
  <p:sldIdLst>
    <p:sldId id='256' r:id='rId2'/>
    <p:sldId id='257' r:id='rId3'/>
    <p:sldId id='258' r:id='rId4'/>
    <p:sldId id='259' r:id='rId5'/>
    <p:sldId id='260' r:id='rId6'/>
    <p:sldId id='261' r:id='rId7'/>
  </p:sldIdLst>
  <p:sldSz cx='12192000' cy='6858000' type='screen16x9'/>
  <p:notesSz cx='6858000' cy='9144000'/>
</p:presentation>
""")

    add('ppt/_rels/presentation.xml.rels', """<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'>
  <Relationship Id='rId1' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster' Target='slideMasters/slideMaster1.xml'/>
  <Relationship Id='rId2' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide' Target='slides/slide1.xml'/>
  <Relationship Id='rId3' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide' Target='slides/slide2.xml'/>
  <Relationship Id='rId4' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide' Target='slides/slide3.xml'/>
  <Relationship Id='rId5' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide' Target='slides/slide4.xml'/>
  <Relationship Id='rId6' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide' Target='slides/slide5.xml'/>
  <Relationship Id='rId7' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide' Target='slides/slide6.xml'/>
</Relationships>
""")

    add('ppt/slideMasters/slideMaster1.xml', """<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<p:sldMaster xmlns:p='http://schemas.openxmlformats.org/presentationml/2006/main' xmlns:a='http://schemas.openxmlformats.org/drawingml/2006/main' xmlns:r='http://schemas.openxmlformats.org/officeDocument/2006/relationships'>
  <p:cSld name='Blank Master'>
    <p:bg>
      <p:bgRef idx='1001'>
        <a:schemeClr val='bg1'/>
      </p:bgRef>
    </p:bg>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id='1' name=''/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x='0' y='0'/>
          <a:ext cx='0' cy='0'/>
          <a:chOff x='0' y='0'/>
          <a:chExt cx='0' cy='0'/>
        </a:xfrm>
      </p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMap accent1='accent1' accent2='accent2' accent3='accent3' accent4='accent4' accent5='accent5' accent6='accent6' bg1='lt1' bg2='lt2' folHlink='folHlink' hlink='hlink' tx1='dk1' tx2='dk2'/>
  <p:sldLayoutIdLst>
    <p:sldLayoutId id='2147483649' r:id='rId1'/>
  </p:sldLayoutIdLst>
</p:sldMaster>
""")

    add('ppt/slideMasters/_rels/slideMaster1.xml.rels', """<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'>
  <Relationship Id='rId1' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout' Target='../slideLayouts/slideLayout1.xml'/>
  <Relationship Id='rId2' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme' Target='../theme/theme1.xml'/>
</Relationships>
""")

    add('ppt/slideLayouts/slideLayout1.xml', """<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<p:sldLayout xmlns:p='http://schemas.openxmlformats.org/presentationml/2006/main' xmlns:a='http://schemas.openxmlformats.org/drawingml/2006/main' xmlns:r='http://schemas.openxmlformats.org/officeDocument/2006/relationships' type='blank' preserve='1'>
  <p:cSld name='Blank'>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id='1' name=''/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x='0' y='0'/>
          <a:ext cx='0' cy='0'/>
          <a:chOff x='0' y='0'/>
          <a:chExt cx='0' cy='0'/>
        </a:xfrm>
      </p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sldLayout>
""")

    add('ppt/slideLayouts/_rels/slideLayout1.xml.rels', """<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'>
  <Relationship Id='rId1' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster' Target='../slideMasters/slideMaster1.xml'/>
</Relationships>
""")

    add('ppt/theme/theme1.xml', """<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<a:theme xmlns:a='http://schemas.openxmlformats.org/drawingml/2006/main' name='Office Theme'>
  <a:themeElements>
    <a:clrScheme name='Office'>
      <a:dk1><a:sysClr val='windowText' lastClr='000000'/></a:dk1>
      <a:lt1><a:sysClr val='window' lastClr='FFFFFF'/></a:lt1>
      <a:dk2><a:srgbClr val='1F1F1F'/></a:dk2>
      <a:lt2><a:srgbClr val='FFFFFF'/></a:lt2>
      <a:accent1><a:srgbClr val='1F5AA6'/></a:accent1>
      <a:accent2><a:srgbClr val='4F81BD'/></a:accent2>
      <a:accent3><a:srgbClr val='C0504D'/></a:accent3>
      <a:accent4><a:srgbClr val='9BBB59'/></a:accent4>
      <a:accent5><a:srgbClr val='8064A2'/></a:accent5>
      <a:accent6><a:srgbClr val='4BACC6'/></a:accent6>
      <a:hlink><a:srgbClr val='0563C1'/></a:hlink>
      <a:folHlink><a:srgbClr val='954F72'/></a:folHlink>
    </a:clrScheme>
    <a:fontScheme name='Office'>
      <a:majorFont><a:latin typeface='Segoe UI'/><a:ea typeface=''/><a:cs typeface=''/></a:majorFont>
      <a:minorFont><a:latin typeface='Segoe UI'/><a:ea typeface=''/><a:cs typeface=''/></a:minorFont>
    </a:fontScheme>
    <a:fmtScheme name='Office'>
      <a:fillStyleLst>
        <a:solidFill><a:schemeClr val='accent1'/></a:solidFill>
        <a:solidFill><a:schemeClr val='lt1'/></a:solidFill>
        <a:solidFill><a:schemeClr val='dk1'/></a:solidFill>
      </a:fillStyleLst>
      <a:lnStyleLst>
        <a:ln w='9525' cap='flat' cmpd='sng' algn='ctr'><a:solidFill><a:schemeClr val='accent1'/></a:solidFill></a:ln>
        <a:ln w='9525' cap='flat' cmpd='sng' algn='ctr'><a:solidFill><a:schemeClr val='dk1'/></a:solidFill></a:ln>
        <a:ln w='9525' cap='flat' cmpd='sng' algn='ctr'><a:solidFill><a:schemeClr val='lt1'/></a:solidFill></a:ln>
      </a:lnStyleLst>
      <a:effectStyleLst>
        <a:effectStyle><a:outerShdw blurRad='38000' dist='23000' dir='5400000'/></a:effectStyle>
        <a:effectStyle><a:outerShdw blurRad='38000' dist='23000' dir='5400000'/></a:effectStyle>
        <a:effectStyle><a:outerShdw blurRad='38000' dist='23000' dir='5400000'/></a:effectStyle>
      </a:effectStyleLst>
      <a:bgFillStyleLst>
        <a:solidFill><a:schemeClr val='lt1'/></a:solidFill>
        <a:solidFill><a:schemeClr val='dk1'/></a:solidFill>
        <a:solidFill><a:srgbClr val='1B2746'/></a:solidFill>
      </a:bgFillStyleLst>
    </a:fmtScheme>
  </a:themeElements>
  <a:objectDefaults/>
  <a:extraClrSchemeLst/>
</a:theme>
""")

    def rect(id, name, x, y, cx, cy, fill='F2F2F2', line='9a9a9a', text=None, font_sz=1800, bold=False, align='l'):
        tx = ''
        if text is not None:
            b = '1' if bold else '0'
            tx = f"""<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:pPr algn='{align}'/><a:r><a:rPr lang='en-US' sz='{font_sz}' b='{b}' smtClean='0'/><a:t>{text}</a:t></a:r><a:endParaRPr lang='en-US'/></a:p></p:txBody>"""
        return f"""<p:sp><p:nvSpPr><p:cNvPr id='{id}' name='{name}'/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x='{x}' y='{y}'/><a:ext cx='{cx}' cy='{cy}'/></a:xfrm><a:prstGeom prst='rect'><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val='{fill}'/></a:solidFill><a:ln w='19050'><a:solidFill><a:srgbClr val='{line}'/></a:solidFill></a:ln></p:spPr>{tx}</p:sp>"""

    def text_box(id, name, x, y, cx, cy, text, size=1600, bold=False, align='l'):
        return rect(id, name, x, y, cx, cy, fill='FFFFFF', line='FFFFFF', text=text, font_sz=size, bold=bold, align=align)

    def slide_xml(title, shapes):
        return f"""<?xml version='1.0' encoding='UTF-8' standalone='yes'?>
<p:sld xmlns:p='http://schemas.openxmlformats.org/presentationml/2006/main' xmlns:a='http://schemas.openxmlformats.org/drawingml/2006/main' xmlns:r='http://schemas.openxmlformats.org/officeDocument/2006/relationships'>
  <p:cSld name='{title}'>
    <p:bg>
      <p:bgPr>
        <a:gradFill flip='none' rotWithShape='1'>
          <a:gsLst>
            <a:gs pos='0'><a:srgbClr val='0f1b3a'/></a:gs>
            <a:gs pos='100000'><a:srgbClr val='1b2746'/></a:gs>
          </a:gsLst>
          <a:lin ang='16200000' scaled='1'/>
        </a:gradFill>
      </p:bgPr>
    </p:bg>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id='1' name=''/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x='0' y='0'/><a:ext cx='0' cy='0'/><a:chOff x='0' y='0'/><a:chExt cx='0' cy='0'/></a:xfrm></p:grpSpPr>
      {shapes}
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>"""

    window_x, window_y = 540000, 540000
    window_cx, window_cy = 11100000, 5770000
    bar_height = 600000

    shapes1 = [
        rect(2,'window',window_x,window_y,window_cx,window_cy,fill='e3e6eb'),
        rect(3,'titlebar',window_x,window_y,window_cx,bar_height,fill='1f5aa6',line='1f5aa6',text='Boot / Welcome',font_sz=1800,bold=True,align='ctr'),
        text_box(4,'title',window_x+400000,window_y+900000,window_cx-800000,1000000,'Abdullah Magdy Elbarrany',2600,True,'ctr'),
        text_box(5,'subtitle',window_x+400000,window_y+2000000,window_cx-800000,800000,'Machine Learning Engineer & Applied AI Specialist — Egypt',1800,False,'ctr'),
        text_box(6,'prompt',window_x+400000,window_y+3000000,window_cx-800000,600000,'Press Enter to continue',1600,False,'ctr')
    ]
    add('ppt/slides/slide1.xml', slide_xml('Slide 1',''.join(shapes1)))
    add('ppt/slides/_rels/slide1.xml.rels', """<Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'><Relationship Id='rId1' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout' Target='../slideLayouts/slideLayout1.xml'/></Relationships>""")

    shapes2=[
        rect(2,'window',window_x,window_y,window_cx,window_cy,fill='e3e6eb'),
        rect(3,'titlebar',window_x,window_y,window_cx,bar_height,fill='1f5aa6',line='1f5aa6',text='About',font_sz=1800,bold=True,align='l'),
        text_box(4,'summary',window_x+300000,window_y+900000,window_cx-600000,1800000,'Machine Learning Engineer building production-grade AI systems across computer vision, LLMs, and applied ML.',1800,False,'l')
    ]
    btn_w, btn_h = 1500000, 420000
    btn_gap = 200000
    start_x = window_x+300000
    start_y = window_y+3000000
    for i,label in enumerate(['Open CV','Open Ask Me.exe','Contact']):
        shapes2.append(rect(10+i,label,start_x+i*(btn_w+btn_gap),start_y,btn_w,btn_h,fill='e6e6e6',line='7a7a7a',text=label,font_sz=1600,bold=True,align='ctr'))
    add('ppt/slides/slide2.xml', slide_xml('Slide 2',''.join(shapes2)))
    add('ppt/slides/_rels/slide2.xml.rels', """<Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'><Relationship Id='rId1' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout' Target='../slideLayouts/slideLayout1.xml'/></Relationships>""")

    shapes3=[rect(2,'window',window_x,window_y,window_cx,window_cy,fill='e3e6eb'),
             rect(3,'titlebar',window_x,window_y,window_cx,bar_height,fill='1f5aa6',line='1f5aa6',text='Featured Projects',font_sz=1800,bold=True,align='l')]
    card_w = (window_cx - 4*200000)//3
    card_h = 3600000
    card_y = window_y+900000
    card_x = window_x+200000
    projects = [
        ('Abnormal Behavior Analysis for Poultry Farms','2024 · ML Engineer',['Pose','Crowd heatmaps','Trajectories','Anomaly detection'],'Add project image/gif here'),
        ('Statue Vision — AI Museum Guide','2023 · ML Engineer',['Mobile app','Vision recognition','Multilingual'],'Add screenshot here'),
        ('BuckTracker — Multi-Banknote Tracking','2023 · ML Engineer',['Banknote tracking','Detection','Counting','Real-time'],'Add demo frame here')
    ]
    shape_id=4
    for idx,(title,meta,bullets,placeholder) in enumerate(projects):
        x = card_x + idx*(card_w+200000)
        shapes3.append(rect(shape_id,'card'+str(idx+1),x,card_y,card_w,card_h,fill='f7f7f7',line='9a9a9a')); shape_id+=1
        shapes3.append(rect(shape_id,'media'+str(idx+1),x+120000,card_y+120000,card_w-240000,1200000,fill='dfe6f5',line='9a9a9a',text=placeholder,font_sz=1400,align='ctr')); shape_id+=1
        shapes3.append(text_box(shape_id,'title'+str(idx+1),x+120000,card_y+1500000,card_w-240000,500000,title,1800,True,'l')); shape_id+=1
        shapes3.append(text_box(shape_id,'meta'+str(idx+1),x+120000,card_y+2050000,card_w-240000,400000,meta,1500,False,'l')); shape_id+=1
        bullets_text = '\n'.join('\u2022 '+b for b in bullets)
        shapes3.append(text_box(shape_id,'bullets'+str(idx+1),x+120000,card_y+2500000,card_w-240000,800000,bullets_text,1500,False,'l')); shape_id+=1
    add('ppt/slides/slide3.xml', slide_xml('Slide 3',''.join(shapes3)))
    add('ppt/slides/_rels/slide3.xml.rels', """<Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'><Relationship Id='rId1' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout' Target='../slideLayouts/slideLayout1.xml'/></Relationships>""")

    shapes4=[rect(2,'window',window_x,window_y,window_cx,window_cy,fill='e3e6eb'),
             rect(3,'titlebar',window_x,window_y,window_cx,bar_height,fill='1f5aa6',line='1f5aa6',text='Project Spotlight: Poultry Farms',font_sz=1800,bold=True,align='l'),
             rect(4,'media',window_x+200000,window_y+900000,window_cx//2-300000,window_cy-1400000,fill='dfe6f5',line='9a9a9a',text='Add project image/gif here',font_sz=1600,align='ctr'),
             text_box(5,'desc',window_x+window_cx//2+100000,window_y+900000,window_cx//2-300000,1200000,'Role: ML Engineer\nYear: 2024\nFocus: Pose, heatmaps, trajectories, anomaly detection (CV)',1600,False,'l'),
             text_box(6,'bullets',window_x+window_cx//2+100000,window_y+2200000,window_cx//2-300000,800000,'Highlights:\n• Multi-camera tracking\n• Anomaly alerts\n• Deployment-ready',1600,False,'l'),
             text_box(7,'impact',window_x+window_cx//2+100000,window_y+3100000,window_cx//2-300000,700000,'Impact / Outcome: ___________________________',1600,False,'l')]
    add('ppt/slides/slide4.xml', slide_xml('Slide 4',''.join(shapes4)))
    add('ppt/slides/_rels/slide4.xml.rels', """<Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'><Relationship Id='rId1' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout' Target='../slideLayouts/slideLayout1.xml'/></Relationships>""")

    shapes5=[rect(2,'window',window_x,window_y,window_cx,window_cy,fill='e3e6eb'),
             rect(3,'titlebar',window_x,window_y,window_cx,bar_height,fill='1f5aa6',line='1f5aa6',text='Quick Stats',font_sz=1800,bold=True,align='l')]
    stat_w = (window_cx - 4*200000)//3
    stat_y = window_y+900000
    stat_h = 2200000
    labels = [
        ('Years','3'),
        ('Focus','Computer Vision\nDeep Learning\nLLM-based Systems\nMLOps & Deployment'),
        ('Tools','Python, PyTorch, TensorFlow, YOLO, OpenCV, Docker')
    ]
    shape_id=4
    for i,(label,value) in enumerate(labels):
        x = window_x+200000 + i*(stat_w+200000)
        shapes5.append(rect(shape_id,'stat'+str(i+1),x,stat_y,stat_w,stat_h,fill='f7f7f7',line='9a9a9a',text=label, font_sz=1700, bold=True, align='ctr')); shape_id+=1
        shapes5.append(text_box(shape_id,'statv'+str(i+1),x+120000,stat_y+600000,stat_w-240000,stat_h-800000,value,1600,False,'l')); shape_id+=1
    add('ppt/slides/slide5.xml', slide_xml('Slide 5',''.join(shapes5)))
    add('ppt/slides/_rels/slide5.xml.rels', """<Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'><Relationship Id='rId1' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout' Target='../slideLayouts/slideLayout1.xml'/></Relationships>""")

    shapes6=[rect(2,'window',window_x,window_y,window_cx,window_cy,fill='e3e6eb'),
             rect(3,'titlebar',window_x,window_y,window_cx,bar_height,fill='1f5aa6',line='1f5aa6',text='Contact',font_sz=1800,bold=True,align='l'),
             text_box(4,'fields',window_x+300000,window_y+900000,window_cx-600000,1400000,'Email: __________________________\nLinkedIn: ________________________\nGitHub: __________________________\nPortfolio: _______________________',1700,False,'l'),
             rect(5,'shutdown',window_x+300000,window_y+2600000,2000000,500000,fill='e6e6e6',line='7a7a7a',text='Shut Down',font_sz=1800,bold=True,align='ctr'),
             text_box(6,'thanks',window_x+300000,window_y+3200000,window_cx-600000,500000,'Thanks for visiting.',1600,False,'l')]
    add('ppt/slides/slide6.xml', slide_xml('Slide 6',''.join(shapes6)))
    add('ppt/slides/_rels/slide6.xml.rels', """<Relationships xmlns='http://schemas.openxmlformats.org/package/2006/relationships'><Relationship Id='rId1' Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout' Target='../slideLayouts/slideLayout1.xml'/></Relationships>""")

    z.close()

if __name__ == '__main__':
    build_pptx(Path('portfolio_abdullah_magdy_elbarrany.pptx'))
    print(Path('portfolio_abdullah_magdy_elbarrany.pptx').resolve())
