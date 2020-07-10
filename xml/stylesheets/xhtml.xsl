<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:d="https://dsg.northeastern.edu/dailp/ns/1.0"
    xpath-default-namespace="http://www.tei-c.org/ns/1.0" xmlns="http://www.w3.org/1999/xhtml">

    <!-- TEI => html -->
    <xsl:template match="TEI">
        <html>
            <head>
                <title>DAILP Document Viewer</title>
            </head>
            <body>
                <xsl:apply-templates/>
            </body>
        </html>
    </xsl:template>

    <!-- teiHeader => [nothing, for now] -->
    <xsl:template match="teiHeader"/>

    <!-- text => [just move on, for now] -->
    <xsl:template match="text">
        <xsl:apply-templates/>
    </xsl:template>

    <!-- group => div -->
    <xsl:template match="group">
        <div id="doc_interface">
            <xsl:apply-templates/>
        </div>
    </xsl:template>

    <!-- group/text => div (id = type) -->
    <xsl:template match="group/text">
        <!-- id = text type -->
        <div class="doc_layer" id="{@type}">
            <xsl:apply-templates/>
        </div>
    </xsl:template>

    <!-- body => div -->
    <xsl:template match="body">
        <div class="doc_container">
            <xsl:apply-templates select="pb"/>
        </div>
    </xsl:template>

    <!-- pb => div -->
    <xsl:template match="pb">
        <div class="doc_page">
            <xsl:apply-templates select="following-sibling::ab"/>
        </div>
    </xsl:template>

    <!-- ab => p -->
    <xsl:template match="ab">
        <p>
            <xsl:apply-templates/>
        </p>
    </xsl:template>

    <!-- lb => br -->
    <xsl:template match="lb">
        <br id="{@n}"/>
    </xsl:template>

    <!-- seg (idea) => span -->
    <xsl:template match="ab/seg">
        <span class="idea_unit" id="{@xml:id}"></span>
    </xsl:template>

    <!-- w => -->
    <!--    <xsl:template match="w"></xsl:template>-->

    <!-- choice => -->
    <!--    <xsl:template match="choice"></xsl:template>-->

    <!-- orig => -->
    <!--    <xsl:template match="orig"></xsl:template>-->

    <!-- reg => -->
    <!--    <xsl:template match="reg"></xsl:template>-->

    <!-- seg => -->
    <!--    <xsl:template match="seg"></xsl:template>-->

    <!-- gap => -->
    <!--    <xsl:template match="gap"></xsl:template>-->

    <!-- text (translataion) => -->
    <!--    <xsl:template match="text"></xsl:template>-->

    <!-- body => -->
    <!--    <xsl:template match="body"></xsl:template>-->

    <!-- ab => -->
    <!--    <xsl:template match="ab"></xsl:template>-->

    <!-- seg => -->
    <!--    <xsl:template match="seg"></xsl:template>-->

    <!-- standOff => -->
    <!--    <xsl:template match="standOff"></xsl:template>-->

    <!-- noteBlock => -->
    <!--    <xsl:template match="d:noteBlock"></xsl:template>-->

    <!-- note => -->
    <!--    <xsl:template match="note"></xsl:template>-->

</xsl:stylesheet>
