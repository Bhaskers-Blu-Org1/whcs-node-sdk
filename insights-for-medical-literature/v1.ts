/**
 * (C) Copyright IBM Corp. 2020.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as extend from 'extend';
import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';
import { Authenticator, BaseService, getAuthenticatorFromEnvironment, getMissingParams, UserOptions, IamAuthenticator } from 'ibm-cloud-sdk-core';
import { getSdkHeaders } from '../lib/common';

/**
 * For more information see the <a href='../../documentation' target='_blank'>extended documentation</a>.<p>Try the <a
 * href='../../application'>Insights for Medical Literature demo application</a>.<h3>Service Overview</h3>The Insights
 * for Medical Literature service provides APIs that enable you to derive insights from a corpus of medical documents.
 * For example, the <a href='https://www.nlm.nih.gov/bsd/pmresources.html' target='_blank'>MEDLINE&reg;</a> corpus
 * contains more than 26 million references to medical journal articles.  An unstructured medical document corpus is
 * ingested by IBM, enriched with the Unified Medical Language System (<a href='https://www.nlm.nih.gov/research/umls/'
 * target='_blank'>UMLS&reg;</a>) and stored as structured data in an IBM managed database.  The UMLS enrichment enables
 * a concept based search, in addition to a conventional text search.  Other unique features include concept matching,
 * concept relationships, identifying co-occurring concepts and identifying disorders, drugs, genes and other medical
 * terms mentioned in a medical document.<h3>National Library of Medicine&reg; (NLM&reg;) License</h3>The MEDLINE corpus
 * is imported from <a href='https://www.nlm.nih.gov/databases/journal.html'
 * target='_blank'>MEDLINE&reg;/PubMed&reg;</a>, a database of the U.S. National Library of Medicine. <P><P>The MEDLINE
 * corpus is periodically updated to contain new and/or maintained records, and remove deleted records, at least once
 * every thirty (30) days. The MEDLINE corpus may be updated on a weekly basis.<P><P>NLM represents that its data were
 * formulated with a reasonable standard of care.  Except for this representation, NLM makes no representation or
 * warranties, expressed or implied.  This includes, but is not limited to, any implied warranty of merchantability or
 * fitness for a particular purpose, with respect to the NLM data, and NLM specifically disclaims any such warranties
 * and representations.<P><P>All complete or parts of U.S. National Library of Medicine (NLM) records that are
 * redistributed or retransmitted must be identified as being derived from NLM  data.<h3>API Overview</h3>The APIs are
 * grouped into these categories:<UL><LI><B>Concepts</B> : Concept information</LI><P>Concept information includes a
 * concept unique identifier (CUI), preferred name, alternative name (other surface forms), semantic group (category),
 * semantic types, counts (hits, parents, children, siblings...) and, related concepts. <LI><B>Corpora</B> : Corpora
 * information</LI><P>You can retrieve a list of corpus names.  For each corpus a unique list of semantic groups and
 * semantic types is provided. <LI><B>Documents</B> : Document information</LI><P>These APIs enable full text documents
 * and document annotations to be retreived.  Concepts mentioned in a medical document may also be categorized by
 * semantic groups and types.  The best matching search concepts can also be identified in a medical
 * document.<LI><B>Search</B> : Concept search</LI><P>These APIs perform typeahead concept searches, ranked document
 * searches, and cohesive and co-occurring concept searches.  A search targets a single medical document
 * corpus.<LI><B>Status</B> : Check the status of this service</LI></UL><h3>Terminology</h3><UL><LI><B>Concept Unique
 * Identifier (cui)</B></LI>A UMLS CUI identifies a concept, and is specified as a path or query parameter to select a
 * specific concept.  A CUI always begins with an uppercase letter 'C' followed by seven decimal digits (e.g.,
 * C0446516).<LI><B>Document Identifiter</B></LI>A document ID uniquely identifies a document in a corpus, and is
 * specified as a path or query parameter to select a specific medical document.<LI><B>Hit count</B></LI>A hit count
 * specifies the number of times a specific concept is mentioned in a corpus.<LI><B>Preferred Name (pn)</B></LI>A
 * preferred name is the common name for a concept.  A concept may also have other surface forms or alternative
 * names.<LI><B>Semantic Group (group)</B></LI>A semantic group aggregates multiple semantic types, and is specified as
 * a path or query parameter to filter or select concepts belonging to the same semantic group (e.g., Disorders or
 * ChemicalsAndDrugs).<LI><B>Semantic Type (type)</B></LI>A semantic type is a camelcase string derived from a UMLS
 * semantic type (e.g., ClinicalDrug or DiseaseOrSyndrome). It is specified as a path or query parameter to filter or
 * select concepts belonging to the same category (semantic type).<LI><B>Surface form</B></LI>A surface form is an
 * alternative name for a concept.  The surface forms identify text spans in a medical document, and the identified text
 * spans are annotated with the matching CUI, preferred name and semantic type.</UL><h3>Typical Document Search
 * Flow</h3><p>1. <b>GET /v1/corpora</b> - Get list of all available corpus names<p>2. <b>GET
 * /v1/corpora/corpus_name/search/typeahead</b> - Use typeahead to select search concepts<p>3. <b>GET
 * /v1/corpora/corpus_name/search/cooccurring_concepts</b> - Find additional co-occurring search concepts<p>4. <b>GET
 * /v1/corpora/corpus_name/concepts/{cui}/matching_concepts</b> - Find additional matching search concepts<p>5. <b>GET
 * /v1/corpora/corpus_name/concepts/{cui}/related_concepts</b> - Find additional related search concepts<p>6. <b>GET
 * /v1/corpora/corpus_name/search/ranked_documents</b> - Search for ranked documents matching search concepts<p>7.
 * <b>GET /v1/corpora/corpus_name/documents/{document_id}/search_matches</b> - Highlight matching search concepts in a
 * ranked documents<p>8. <b>GET /v1/corpora/corpus_name/documents/{document_id}/categories</b> - Highlight diseases,
 * drugs and genes in a ranked document
 */

class InsightsForMedicalLiteratureServiceV1 extends BaseService {

  static DEFAULT_SERVICE_URL: string = 'https://cloud.ibm.com/wh-iml/api';
  static DEFAULT_SERVICE_NAME: string = 'insights_for_medical_literature_service';

  /*************************
   * Factory method
   ************************/

  /**
   * Constructs an instance of InsightsForMedicalLiteratureServiceV1 with passed in options and external configuration.
   *
   * @param {UserOptions} [options] - The parameters to send to the service.
   * @param {string} [options.serviceName] - The name of the service to configure
   * @param {Authenticator} [options.authenticator] - The Authenticator object used to authenticate requests to the service
   * @param {string} [options.serviceUrl] - The URL for the service
   * @returns {InsightsForMedicalLiteratureServiceV1}
   */

  public static newInstance(options: UserOptions): InsightsForMedicalLiteratureServiceV1 {
    options = options || {};

    if (!options.serviceName) {
      options.serviceName = this.DEFAULT_SERVICE_NAME;
    }
    if (!options.authenticator) {
      options.authenticator = getAuthenticatorFromEnvironment(options.serviceName);
    }
    const service = new InsightsForMedicalLiteratureServiceV1(options);
    service.configureService(options.serviceName);
    if (options.serviceUrl) {
      service.setServiceUrl(options.serviceUrl);
    }
    return service;
  }


  /** The release date of the version of the API you want to use. Specify dates in YYYY-MM-DD format. */
  version: string;

  /**
   * Construct a InsightsForMedicalLiteratureServiceV1 object.
   *
   * @param {Object} options - Options for the service.
   * @param {string} options.version - The release date of the version of the API you want to use. Specify dates in
   * YYYY-MM-DD format.
   * @param {string} [options.serviceUrl] - The base url to use when contacting the service (e.g. 'https://gateway.watsonplatform.net/services/medical_insights/api'). The base url may differ between IBM Cloud regions.
   * @param {OutgoingHttpHeaders} [options.headers] - Default headers that shall be included with every request to the service.
   * @param {Authenticator} options.authenticator - The Authenticator object used to authenticate requests to the service
   * @constructor
   * @returns {InsightsForMedicalLiteratureServiceV1}
   */
  constructor(options: UserOptions) {
    options = options || {};

    const requiredParams = ['version'];
    const missingParams = getMissingParams(options, requiredParams);
    if (missingParams) {
      throw missingParams;
    }

    super(options);
    if (options.serviceUrl) {
      this.setServiceUrl(options.serviceUrl);
    } else {
      this.setServiceUrl(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_URL);
    }
    this.version = options.version;
  }

  /*************************
   * documents
   ************************/

  /**
   * Retrieves information about the documents in this corpus.
   *
   * The response returns the following information: <ul><li>number of documents in the corpus</li><li>corpus
   * provider</li></ul>.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Corpus name.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.CorpusModel>>}
   */
  public getDocuments(params: InsightsForMedicalLiteratureServiceV1.GetDocumentsParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.CorpusModel>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const query = {
        'version': this.version
      };
      const path = {
        'corpus': _params.corpus
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}/documents',
          method: 'GET',
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true,  {
            'Accept': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Define enrichment document.
   *
   * The response returns whether the document was properly added to the corpus.  <P>This API should be used for adding
   * a document to a custom corpus.<P>Example POST body:<pre>{
   *   "acdUrl" :
   *   "acdApiKeyl" :
   *   "flowId" :
   *   "document" : {
   *    "doc_id" :
   *    "field[n]" : "value"
   *   }
   *   "otherAnnotators" : [   "{    "annotatorUrl    "annotatorApiKey    "containerName   "}  ]
   * }
   * </pre>.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Corpus name.
   * @param {JsonObject} [params.document] - JSON based document for enrichment.
   * @param {string} [params.acdUrl] - Annotator for clincial data url.
   * @param {string} [params.apiKey] - Security key.
   * @param {string} [params.flowId] - Enrichment flow identifier.
   * @param {string} [params.accessToken] - Cloud access token.
   * @param {JsonObject[]} [params.otherAnnotators] - URLs and API keys for custom annotators.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.Empty>>}
   */
  public addCorpusDocument(params: InsightsForMedicalLiteratureServiceV1.AddCorpusDocumentParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.Empty>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const body = {
        'document': _params.document,
        'acdUrl': _params.acdUrl,
        'apiKey': _params.apiKey,
        'flowId': _params.flowId,
        'accessToken': _params.accessToken,
        'otherAnnotators': _params.otherAnnotators
      };

      const query = {
        'version': this.version
      };

      const path = {
        'corpus': _params.corpus
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}/documents',
          method: 'POST',
          body,
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Content-Type': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Retrieves the external ID, title, abstract and text for a document.
   *
   * The response may return the following fields:<ul><li>external ID (e.g., PubMed
   * ID)</li><li>title</li><li>abstract</li><li>body</li><li>pdfUrl</li><li>referenceUrl</li><li>other
   * metadata</li></ul>Note, some documents may not have an abstract, or only the abstract may be available without the
   * body text.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Corpus name.
   * @param {string} params.documentId - Document ID.
   * @param {boolean} [params.verbose] - Verbose output. If true, text for all document sections is returned.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.GetDocumentInfoResponse>>}
   */
  public getDocumentInfo(params: InsightsForMedicalLiteratureServiceV1.GetDocumentInfoParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.GetDocumentInfoResponse>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus', 'documentId'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const query = {
        'version': this.version,
        'verbose': _params.verbose
      };

      const path = {
        'corpus': _params.corpus,
        'document_id': _params.documentId
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}/documents/{document_id}',
          method: 'GET',
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Accept': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Retrieves annotations for a document.
   *
   * The response returns a list of all the annotations contained in the document.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Corpus name.
   * @param {string} params.documentId - Document ID.
   * @param {string} params.documentSection - Document section to annotate. (e.g., title, abstract, body...
   * @param {string[]} [params.cuis] - Concepts to show.  Defaults to all concepts.
   * @param {boolean} [params.includeText] - Include document text.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.Empty>>}
   */
  public getDocumentAnnotations(params: InsightsForMedicalLiteratureServiceV1.GetDocumentAnnotationsParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.Empty>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus', 'documentId', 'documentSection'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const query = {
        'version': this.version,
        'document_section': _params.documentSection,
        'cuis': _params.cuis,
        'include_text': _params.includeText
      };

      const path = {
        'corpus': _params.corpus,
        'document_id': _params.documentId
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}/documents/{document_id}/annotations',
          method: 'GET',
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Categorizes concepts in a document.
   *
   * The response returns a categorized list of text passages in a document.  The sentences are grouped by concept with
   * the matching concepts highlighted.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Corpus name.
   * @param {string} params.documentId - Document ID.
   * @param {string} [params.highlightTagBegin] - HTML tag used to highlight concepts found in the text.  Default is
   * '&ltb&gt'.
   * @param {string} [params.highlightTagEnd] - HTML tag used to highlight concepts found in the text.  Default is
   * '&lt/b&gt'.
   * @param {string[]} [params.types] - Select concepts belonging to these semantic types to return. Semantic types for
   * the corpus can be found using the /v1/corpora/{corpus}/types method.Defaults to 'all'.
   * @param {string} [params.category] - Select concepts belonging to disorders, drugs or genes.
   * @param {boolean} [params.onlyNegatedConcepts] - Only return negated concepts?.
   * @param {string} [params.fields] - Comma separated list of fields to return:  passages, annotations,
   * highlightedTitle, highlightedAbstract, highlightedBody, highlightedSections.
   * @param {number} [params.limit] - Limit the number of passages per search concept (1 to 250).  Default is 50.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.CategoriesModel>>}
   */
  public getDocumentCategories(params: InsightsForMedicalLiteratureServiceV1.GetDocumentCategoriesParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.CategoriesModel>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus', 'documentId'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const query = {
        'version': this.version,
        'highlight_tag_begin': _params.highlightTagBegin,
        'highlight_tag_end': _params.highlightTagEnd,
        'types': _params.types,
        'category': _params.category,
        'only_negated_concepts': _params.onlyNegatedConcepts,
        '_fields': _params.fields,
        '_limit': _params.limit
      };

      const path = {
        'corpus': _params.corpus,
        'document_id': _params.documentId
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}/documents/{document_id}/categories',
          method: 'GET',
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Accept': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Categorizes concepts in a document.
   *
   * The response returns multiple categorized lists of text passages in a document.  The sentences are grouped by
   * concept with the matching concepts highlighted.<P>This API should be used to batch multiple categories in a single
   * request to improve performance.<P>Example POST body:<pre>{
   *  categories: [
   *   {
   *    name : 'disorders',
   *    category : 'disorders'
   *   },
   *   {
   *    name : 'drugs',
   *    category : 'drugs'
   *   },
   *   {
   *    name : 'genes',
   *    category : 'genes'
   *   },
   *   {
   *    name : 'negated',
   *    category : 'negated'
   *   },
   *   {
   *    name : 'finding','
   *    types : ['Finding']
   *   },
   *  ]
   * }
   * </pre>.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Corpus name.
   * @param {string} params.documentId - Document ID.
   * @param {Object} params.categories - Categories.
   * @param {string} [params.highlightTagBegin] - HTML tag used to highlight concepts found in the text.  Default is
   * '&ltb&gt'.
   * @param {string} [params.highlightTagEnd] - HTML tag used to highlight concepts found in the text.  Default is
   * '&lt/b&gt'.
   * @param {string} [params.fields] - Comma separated list of fields to return:  passages, annotations,
   * highlightedTitle, highlightedAbstract, highlightedBody, highlightedSections.
   * @param {number} [params.limit] - Limit the number of passages per search concept (1 to 250).  Default is 50.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.CategoriesModel>>}
   */
  public getDocumentMultipleCategories(params: InsightsForMedicalLiteratureServiceV1.GetDocumentMultipleCategoriesParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.CategoriesModel>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus', 'documentId'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const body = {
        'categories': _params.categories
      };

      const query = {
        'version': this.version,
        'highlight_tag_begin': _params.highlightTagBegin,
        'highlight_tag_end': _params.highlightTagEnd,
        '_fields': _params.fields,
        '_limit': _params.limit
      };

      const path = {
        'corpus': _params.corpus,
        'document_id': _params.documentId
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}/documents/{document_id}/categories',
          method: 'POST',
          body,
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Finds concepts in a document matching a set of search concepts.
   *
   * Returns matching concepts and text passages. The sentences containing each concept are returned with the concept
   * highlighted. <p>Extended annotations provide additional details for  each discrete search match detected in the
   * document.  An iml-annotation-id attribute is added to each highlight tag which allows an application to easily show
   * the annotation details when hovering over a text span.  The iml-annotation-id may also be used to color code the
   * text spans.  The ibm_annotation-id is used as a key for the returned annotations. <p>For example, a search match on
   * the concept "Breast Carcinoma" will have a class name "iml-breast-carcinoma" inserted in the highlight tag, and the
   * returned annotations['umls-breast_carcinoma-hypothetical'] JSON field will contain the detailed annotation data:
   * <pre>{
   *  "cui": "C0678222"
   *  "hypothetical": true
   *  "preferredName": "Breast Carcinoma"
   *  "semanticType": "umls.NeoplasticProcess"
   *  "source": "umls"
   *  "type": "umls.NeoplasticProcess"
   * }
   * </pre>.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Corpus name.
   * @param {string} params.documentId - Document ID (e.g, 7014026).
   * @param {number} params.minScore - Minimum score .0 to 1.0.
   * @param {string[]} [params.cuis] - cui[,rank,[type]] - Example: "C0030567,10". The rank is an optional value from 0
   * to 10 (defalut is 10). Special rank values: 0=omit, 10=require. Related concepts can also be included by appending,
   * '-PAR' (parents), '-CHD' (children), or '-SIB' (siblings) to the CUI (eg., to include all children of C0030567:
   * 'C0030567-CHD')).  The type may explicitly select a semanic type for a concept.  If no type is specified, a default
   * type is selected.
   * @param {string[]} [params.text] - Case insensitive text searches.
   * @param {string[]} [params.types] - Highlight all text spans matching these semantic types.  Semantic types for the
   * corpus can be found using the /v1/corpora/{corpus}/types method.
   * @param {number} [params.limit] - Limit the number of matching passages per search concept/search term (1 to 250).
   * Default is 50.
   * @param {string} [params.searchTagBegin] - HTML tag used to highlight search concepts found in the text.  Default is
   * '&ltb&gt'.
   * @param {string} [params.searchTagEnd] - HTML tag used to highlight search concepts found in the text.  Default is
   * '&lt/b&gt'.
   * @param {string} [params.relatedTagBegin] - HTML tag used to highlight related concepts found in the text.
   * @param {string} [params.relatedTagEnd] - HTML tag used to highlight related concepts found in the text.
   * @param {string} [params.fields] - Comma separated list of fields to return:  passages, annotations,
   * highlightedTitle, highlightedAbstract, highlightedBody, highlightedSections.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.SearchMatchesModel>>}
   */
  public getSearchMatches(params: InsightsForMedicalLiteratureServiceV1.GetSearchMatchesParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.SearchMatchesModel>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus', 'documentId', 'minScore'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const query = {
        'version': this.version,
        'min_score': _params.minScore,
        'cuis': _params.cuis,
        'text': _params.text,
        'types': _params.types,
        '_limit': _params.limit,
        'search_tag_begin': _params.searchTagBegin,
        'search_tag_end': _params.searchTagEnd,
        'related_tag_begin': _params.relatedTagBegin,
        'related_tag_end': _params.relatedTagEnd,
        '_fields': _params.fields
      };

      const path = {
        'corpus': _params.corpus,
        'document_id': _params.documentId
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}/documents/{document_id}/search_matches',
          method: 'GET',
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Accept': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /*************************
   * status
   ************************/

  /**
   * Determine if service is running correctly.
   *
   * This resource differs from /status in that it will will always return a 500 error if the service state is not OK.
   * This makes it simpler for service front ends (such as Datapower) to detect a failed service.
   *
   * @param {Object} [params] - The parameters to send to the service.
   * @param {string} [params.accept] - The type of the response: application/json or application/xml.
   * @param {string} [params.format] - Override response format.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.ServiceStatus>>}
   */
  public getHealthCheckStatus(params?: InsightsForMedicalLiteratureServiceV1.GetHealthCheckStatusParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.ServiceStatus>> {
    const _params = extend({}, params);

    return new Promise((resolve, reject) => {
      const query = {
        'format': _params.format
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/status/health_check',
          method: 'GET',
          qs: query,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true,  {
            'Accept': _params.accept
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /*************************
   * search
   ************************/

  /**
   * Search for concepts, documents, and authors.
   *
   * Features include:<ul><li>Concept search</li><li>Keyword search</li><li>Attributes search</li><li>Attributes
   * typeahead</li><li>Regular expressions</li><li>Find passages</li><li>Selecting authors</li><li>Selecting
   * providers</li><li>Date ranges: publish date</li><li>Pagination</li><li>Aggregation: authors, concepts, and
   * documents</li><li>Document date histogram</li></ul>.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Corpus name.
   * @param {string} params.body - Define the query using JSON.<script>function setSearchApiBody(e,file)
   * {$.get(file).done(function(text) {
   * $(e.target).closest('td').prev('td').find('textarea').val(text);})}</script><p>Try sample queries:<ul
   * style='margin-top: 0; list-style:none; padding-left:0;'><li><span style='text-decoration: underline; cursor:
   * pointer;' onclick='setSearchApiBody(event, "conceptSearch.json")'><a>Concept Search</a></span></li><li><span
   * style='text-decoration: underline; cursor: pointer;' onclick='setSearchApiBody(event,
   * "conceptsAggregation.json")'><a>Concepts Aggregation</a></span></li><li><span style='text-decoration: underline;
   * cursor: pointer;' onclick='setSearchApiBody(event, "keywordSearch.json")'><a>Keyword
   * Search</a></span></li><li><span style='text-decoration: underline; cursor: pointer;'
   * onclick='setSearchApiBody(event, "attributeSearch.json")'><a>Attribute Search</a></span></li><li><span
   * style='text-decoration: underline; cursor: pointer;' onclick='setSearchApiBody(event, "types.json")'><a>Get
   * Semantic Types</a></span></li><li><span style='text-decoration: underline; cursor: pointer;'
   * onclick='setSearchApiBody(event, "attributes.json")'><a>Attributes</a></span></li><li><span style='text-decoration:
   * underline; cursor: pointer;' onclick='setSearchApiBody(event, "attributeTypeahead.json")'><a>Attribute
   * Typeahead</a></span></li><li><span style='text-decoration: underline; cursor: pointer;'
   * onclick='setSearchApiBody(event, "conceptTypeahead.json")'><a>Concept Typeahead</a></span></li><li><span
   * style='text-decoration: underline; cursor: pointer;' onclick='setSearchApiBody(event,
   * "passages.json")'><a>Passages</a></span></li><li><span style='text-decoration: underline; cursor: pointer;'
   * onclick='setSearchApiBody(event, "authorSearch.json")'><a>Author Search</a></span></li><li><span
   * style='text-decoration: underline; cursor: pointer;' onclick='setSearchApiBody(event,
   * "authorsAggregation.json")'><a>Author Aggregation</a></span></li><li><span style='text-decoration: underline;
   * cursor: pointer;' onclick='setSearchApiBody(event, "authorTypeahead.json")'><a>Author
   * Typeahead</a></span></li><li><span style='text-decoration: underline; cursor: pointer;'
   * onclick='setSearchApiBody(event, "titleTypeahead.json")'><a>Title Typeahead</a></span></li><li><span
   * style='text-decoration: underline; cursor: pointer;' onclick='setSearchApiBody(event,
   * "dateHistogram.json")'><a>Date Histogram</a></span></li><li><span style='text-decoration: underline; cursor:
   * pointer;' onclick='setSearchApiBody(event, "dateRange.json")'><a>Date Range</a></span></li><li><span
   * style='text-decoration: underline; cursor: pointer;' onclick='setSearchApiBody(event,
   * "advancedSearch.json")'><a>Advanced Search</a></span></li></ul>.
   * @param {boolean} [params.verbose] - Verbose output.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.SearchModel>>}
   */
  public search(params: InsightsForMedicalLiteratureServiceV1.SearchParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.SearchModel>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus', 'body'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const body = _params.body;
      const query = {
        'version': this.version,
        'verbose': _params.verbose
      };

      const path = {
        'corpus': _params.corpus
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}/search',
          method: 'POST',
          body,
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Retrieves a list of metadata fields defined in the corpus.
   *
   * The response returns a list of metadata field names that can be used by the POST search API.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Corpus name.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.MetadataModel>>}
   */
  public getFields(params: InsightsForMedicalLiteratureServiceV1.GetFieldsParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.MetadataModel>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const query = {
        'version': this.version
      };

      const path = {
        'corpus': _params.corpus
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}/search/metadata',
          method: 'GET',
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Accept': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Find concepts matching the specified query string.
   *
   * Searches concepts mentioned in the corpus looking for matches on the query string field. The comparison is not case
   * sensitive. The main use of this method is to build query boxes that offer auto-complete, to allow users to select
   * valid concepts.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Comma-separated corpora names.
   * @param {string} params.query - Query string.
   * @param {string[]} [params.ontologies] - Include suggestions belonging to the selected ontology(ies).
   * @param {string[]} [params.types] - Include or exclude suggestions belonging to one of these types.  Types can be
   * found using /v1/corpora/{corpus}/types method.  Defaults to all.
   * @param {string} [params.category] - Select concepts belonging to disorders, drugs or genes.
   * @param {boolean} [params.verbose] - Verbose output.  Include hit counts and relationship counts for each concept.
   * @param {number} [params.limit] - Maximum number of suggestions to return.
   * @param {number} [params.maxHitCount] - Maximum hit (document) count for suggested concepts. Default is 500000.
   * High hit count concepts tend to be very broad (e.g, Disease) and result in longer search times.
   * @param {boolean} [params.noDuplicates] - Remove duplicate concepts.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.ConceptListModel>>}
   */
  public typeahead(params: InsightsForMedicalLiteratureServiceV1.TypeaheadParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.ConceptListModel>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus', 'query'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const query = {
        'version': this.version,
        'query': _params.query,
        'ontologies': _params.ontologies,
        'types': _params.types,
        'category': _params.category,
        'verbose': _params.verbose,
        '_limit': _params.limit,
        'max_hit_count': _params.maxHitCount,
        'no_duplicates': _params.noDuplicates
      };

      const path = {
        'corpus': _params.corpus
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}/search/typeahead',
          method: 'GET',
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Accept': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /*************************
   * corpora
   ************************/

  /**
   * Retrieves the available corpus names and configuration.
   *
   * The response returns an array of available corpus names and optionally includes detailed configuation parameters.
   *
   * @param {Object} [params] - The parameters to send to the service.
   * @param {boolean} [params.verbose] - Verbose output.  Default verbose = false.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.CorporaConfig>>}
   */
  public getCorporaConfig(params?: InsightsForMedicalLiteratureServiceV1.GetCorporaConfigParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.CorporaConfig>> {
    const _params = extend({}, params);

    return new Promise((resolve, reject) => {
      const query = {
        'version': this.version,
        'verbose': _params.verbose
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora',
          method: 'GET',
          qs: query,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true,  {
            'Accept': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Define service repository data model.
   *
   * The response returns whether the instance schema was properly created.  <P>This API should be used for defining a
   * custom corpus schema.<P>Example POST body:<pre>{
   *    corpusName : 'string'
   *   "enrichmentTargets" : [
   *    {
   *     "contentField": 'string',
   *     "enrichmentField : 'string'
   *    }
   *   ],
   *   "metadataFields" : [
   *    {
   *     "fieldName": 'string',
   *     "fieldType : 'string'
   *    }
   *   ],
   *   "referenceIndices" : {
   *    "dictionaryIndex" : "my_umls",
   *    "attributeIndex" : "my_attributes",
   *    "meshIndex" : "my_mesh",
   *   }
   * }
   * </pre>.
   *
   * @param {Object} [params] - The parameters to send to the service.
   * @param {JsonObject[]} [params.enrichmentTargets] - Input and Output field names.
   * @param {JsonObject[]} [params.metadataFields] - Metadata field names.
   * @param {string} [params.corpusName] - Corpus name.
   * @param {JsonObject} [params.references] - Reference indices.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.ConfigurationStatusModel>>}
   */
  public setCorpusSchema(params?: InsightsForMedicalLiteratureServiceV1.SetCorpusSchemaParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.ConfigurationStatusModel>> {
    const _params = extend({}, params);

    return new Promise((resolve, reject) => {
      const body = {
        'enrichmentTargets': _params.enrichmentTargets,
        'metadataFields': _params.metadataFields,
        'corpusName': _params.corpusName,
        'references': _params.references
      };

      const query = {
        'version': this.version
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora',
          method: 'POST',
          body,
          qs: query,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Delete a corpus.
   *
   * The response returns whether the instance schema was properly deleted.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.instance - corpus schema.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.ConfigurationStatusModel>>}
   */
  public deleteCorpusSchema(params: InsightsForMedicalLiteratureServiceV1.DeleteCorpusSchemaParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.ConfigurationStatusModel>> {
    const _params = extend({}, params);
    const requiredParams = ['instance'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const query = {
        'version': this.version,
        'instance': _params.instance
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora',
          method: 'DELETE',
          qs: query,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Accept': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Define service repository.
   *
   * The response returns whether the service successfully tested a connection to the specified repository and submitted
   * the new configuration.<P>This API should be used for providing a custom enriched corpus.<P>Example POST body:<pre>{
   *    userName : 'string',
   *    password : 'string'
   *    repositoryUri : 'uri'
   * }
   * </pre>.
   *
   * @param {Object} [params] - The parameters to send to the service.
   * @param {string} [params.userName] - Repository connection userid.
   * @param {string} [params.password] - Repository connection password.
   * @param {string} [params.corpusUri] - Repository connection URI.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.ConfigurationStatusModel>>}
   */
  public setCorpusConfig(params?: InsightsForMedicalLiteratureServiceV1.SetCorpusConfigParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.ConfigurationStatusModel>> {
    const _params = extend({}, params);

    return new Promise((resolve, reject) => {
      const body = {
        'userName': _params.userName,
        'password': _params.password,
        'corpusURI': _params.corpusUri
      };

      const query = {
        'version': this.version
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/configure',
          method: 'POST',
          body,
          qs: query,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Enable monitoring for a custom instance.
   *
   * This API is meant to be used for IBM Cloud automated monitoring of custom plan instances.  A service api-key with
   * read only role can be submitted to enable monitoring.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.apikey - Apikey with read only permissions for monitoring.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.Empty>>}
   */
  public monitorCorpus(params: InsightsForMedicalLiteratureServiceV1.MonitorCorpusParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.Empty>> {
    const _params = extend({}, params);
    const requiredParams = ['apikey'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const query = {
        'version': this.version,
        'apikey': _params.apikey
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/monitor',
          method: 'PUT',
          qs: query,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Toggle Search Activity Tracking.
   *
   * The response returns whether the request to enable or disable tracking was accepted.
   *
   * @param {Object} [params] - The parameters to send to the service.
   * @param {boolean} [params.enableTracking] - Enable corpus read event tracking.  Default is false.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.Empty>>}
   */
  public enableCorpusSearchTracking(params?: InsightsForMedicalLiteratureServiceV1.EnableCorpusSearchTrackingParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.Empty>> {
    const _params = extend({}, params);

    return new Promise((resolve, reject) => {
      const query = {
        'version': this.version,
        'enable_tracking': _params.enableTracking
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/tracking',
          method: 'PUT',
          qs: query,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Retrieves the corpus configuration.
   *
   * The response returns the corpus configuration.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Corpus name.
   * @param {boolean} [params.verbose] - Verbose output.  Default verbose = false.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.CorporaConfig>>}
   */
  public getCorpusConfig(params: InsightsForMedicalLiteratureServiceV1.GetCorpusConfigParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.CorporaConfig>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const query = {
        'version': this.version,
        'verbose': _params.verbose
      };

      const path = {
        'corpus': _params.corpus
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }
      
      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}',
          method: 'GET',
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Accept': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /*************************
   * concepts
   ************************/

  /**
   * Retrieves information for concepts mentioned in this corpus.
   *
   * The response returns concepts mentioned in this corpus.  The returned concepts may be selected by CUI, preferred
   * name, suface forms and attribute name.  All selected concepts are returned.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Corpus name.
   * @param {string[]} [params.cuis] - Select concepts with the specified CUIs. Each cui is assumed to be from UMLS
   * unless an ontology is explicitly specified using the syntax [ontology:]cui, e.g., 'concepts:C0018787'.
   * @param {string[]} [params.preferredNames] - Select concepts with the specified preferred names. Each preferred name
   * is assumed to be from UMLS unless an ontology is explicitly specified using the syntax [ontology:::]preferred_name,
   * e.g., 'concepts:::HEART'.
   * @param {string[]} [params.surfaceForms] - Select all concepts having these surface forms. The match is case
   * insensitive. Each surface form is matched against UMLS unless an ontology is explicitly specified using the syntax
   * [ontology:::]surface_form, e.g., 'concepts:::heart attack'.
   * @param {string[]} [params.attributes] - Select all concepts having these attributes. The match is case insensitive.
   * @param {boolean} [params.verbose] - Verbose output.  Default is false.
   * @param {string} [params.sort] - Sort by hitCount (in document count).  Set to ascending order (_sort=+hitCount) or
   * descending order (_sort=-hitCount).
   * @param {number} [params.limit] - Number of possible concepts to return. Default is 250.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.ConceptListModel>>}
   */
  public getConcepts(params: InsightsForMedicalLiteratureServiceV1.GetConceptsParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.ConceptListModel>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const query = {
        'version': this.version,
        'cuis': _params.cuis,
        'preferred_names': _params.preferredNames,
        'surface_forms': _params.surfaceForms,
        'attributes': _params.attributes,
        'verbose': _params.verbose,
        '_sort': _params.sort,
        '_limit': _params.limit
      };

      const path = {
        'corpus': _params.corpus
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}/concepts',
          method: 'GET',
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Accept': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Add cartridge artifact.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Corpus name.
   * @param {DictonaryEntry} [params.dictionaryEntry] -
   * @param {AttributeEntry} [params.attributeEntry] -
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.Empty>>}
   */
  public addArtifact(params: InsightsForMedicalLiteratureServiceV1.AddArtifactParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.Empty>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const body = {
        'dictionaryEntry': _params.dictionaryEntry,
        'attributeEntry': _params.attributeEntry
      };

      const query = {
        'version': this.version
      };

      const path = {
        'corpus': _params.corpus
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}/concepts/definitions',
          method: 'POST',
          body,
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Content-Type': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Retrieve information for a concept.
   *
   * The followning fields may be retrieved: <ul><li>Preferred name</li><li>Semantic types</li><li>Surface forms -
   * Ontology Dictionary names for this concept</li><li>Definition - Concept definition (if available)</li><li>Related
   * Concepts info</li></ul><P>The default is to return all fields.  Individual fields may be selected using the
   * '_fields' query parameter.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Corpus name.
   * @param {string} params.nameOrId - Preferred name or concept ID.
   * @param {string} [params.ontology] - The ontology that defines the cui.
   * @param {string} [params.fields] - Comma separated list of fields to return: preferredName, semanticTypes,
   * surfaceForms, typeahead, variants, definition.  Defaults to all fields.
   * @param {boolean} [params.treeLayout] - Generate JSON output that is compatible with a d3 tree layout.  Default is
   * false.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.ConceptInfoModel>>}
   */
  public getCuiInfo(params: InsightsForMedicalLiteratureServiceV1.GetCuiInfoParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.ConceptInfoModel>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus', 'nameOrId'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const query = {
        'version': this.version,
        'ontology': _params.ontology,
        '_fields': _params.fields,
        'tree_layout': _params.treeLayout
      };

      const path = {
        'corpus': _params.corpus,
        'name_or_id': _params.nameOrId
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}/concepts/{name_or_id}',
          method: 'GET',
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Accept': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Retrieves a count of the number of times a concept is mentioned in the corpus.
   *
   * The response returns the number of times a concept is mentioned (hit count) in the corpus.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Corpus name.
   * @param {string} params.nameOrId - Preferred name or concept ID.
   * @param {string} [params.ontology] - The ontology that defines the cui.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.HitCount>>}
   */
  public getHitCount(params: InsightsForMedicalLiteratureServiceV1.GetHitCountParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.HitCount>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus', 'nameOrId'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const query = {
        'version': this.version,
        'ontology': _params.ontology
      };

      const path = {
        'corpus': _params.corpus,
        'name_or_id': _params.nameOrId
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}/concepts/{name_or_id}/hit_count',
          method: 'GET',
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Accept': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Retrieve concepts related to a concept.
   *
   * Returns a list of related concepts mentioned in the specified corpus. The following relationships are suppored:
   * <ul><li><b>children</b> child concepts</li><li><b>parents</b> parent concepts</li><li><b>siblings</b> sibling
   * concepts</li><li><b>synonyms</b> synonym concepts</li><li><b>qualified by</b> qualified by
   * concepts</li><li><b>broader</b> broader concepts</li><li><b>narrower</b> narrower concepts</li><li><b>other</b>
   * other than synonyms, narrower or broader</li><li><b>related</b> related and posibly synonymous
   * concepts</li></ul><p>If the corpus path parameter can be set to 'umls' to look up relationship in the entire UMLS
   * dictionary.  Otherwise, an actual corpus name may be specified to limit the output to only those concepts mentioned
   * in a specific corpus.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Corpus name or null to show all ontology relationships.
   * @param {string} params.nameOrId - Preferred name or concept ID.
   * @param {string} params.relationship - Select the relationship to retrieve.
   * @param {string} [params.ontology] - The ontology that defines the cui.
   * @param {string[]} [params.relationshipAttributes] - Select UMLS relationship attributes.  If null, all relationship
   * attributes are returned.
   * @param {string[]} [params.sources] - Select source vocabularies.  If null, concepts for all source vocabularies are
   * returned.
   * @param {boolean} [params.recursive] - Recursively return parents, children, broader and narrower relations.
   * Default is false.
   * @param {boolean} [params.treeLayout] - Generate JSON output that is compatible with a d3 tree layout.  Default is
   * true.
   * @param {number} [params.maxDepth] - Maximum depth.  Default is 3.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.RelatedConceptsModel>>}
   */
  public getRelatedConcepts(params: InsightsForMedicalLiteratureServiceV1.GetRelatedConceptsParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.RelatedConceptsModel>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus', 'nameOrId', 'relationship'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const query = {
        'relationship': _params.relationship,
        'version': this.version,
        'ontology': _params.ontology,
        'relationship_attributes': _params.relationshipAttributes,
        'sources': _params.sources,
        'recursive': _params.recursive,
        'tree_layout': _params.treeLayout,
        'max_depth': _params.maxDepth
      };

      const path = {
        'corpus': _params.corpus,
        'name_or_id': _params.nameOrId
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}/concepts/{name_or_id}/related_concepts',
          method: 'GET',
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Accept': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };

  /**
   * Find similar concepts.
   *
   * The response returns a list of similar concepts.   All ontologies defined in the corpora are searched.  Similarity
   * is determined by checking for overlapping surface forms.  The results are sorted in descending order by hit count.
   *
   * @param {Object} params - The parameters to send to the service.
   * @param {string} params.corpus - Corpus name.
   * @param {string} params.nameOrId - Preferred name or concept ID.
   * @param {string[]} params.returnOntologies - Return similar concepts from any of these ontologites.
   * @param {string} [params.ontology] - The ontology that defines the cui.
   * @param {number} [params.limit] - Number of possible concepts to return. Default is 250.
   * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
   * @returns {Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.ConceptListModel>>}
   */
  public getSimilarConcepts(params: InsightsForMedicalLiteratureServiceV1.GetSimilarConceptsParams): Promise<InsightsForMedicalLiteratureServiceV1.Response<InsightsForMedicalLiteratureServiceV1.ConceptListModel>> {
    const _params = extend({}, params);
    const requiredParams = ['corpus', 'nameOrId', 'returnOntologies'];

    return new Promise((resolve, reject) => {
      const missingParams = getMissingParams(_params, requiredParams);
      if (missingParams) {
        return reject(missingParams);
      }

      const query = {
        'version': this.version,
        'return_ontologies': _params.returnOntologies,
        'ontology': _params.ontology,
        '_limit': _params.limit
      };

      const path = {
        'corpus': _params.corpus,
        'name_or_id': _params.nameOrId
      };

      var sdkHeaders = {};
      if (this.baseOptions.serviceUrl.indexOf("rch") < 0){
        sdkHeaders = getSdkHeaders(InsightsForMedicalLiteratureServiceV1.DEFAULT_SERVICE_NAME, 'v1', 'getCorpusConfig');
      }

      const parameters = {
        options: {
          url: '/v1/corpora/{corpus}/concepts/{name_or_id}/similar_concepts',
          method: 'GET',
          qs: query,
          path,
        },
        defaultOptions: extend(true, {}, this.baseOptions, {
          headers: extend(true, sdkHeaders, {
            'Accept': 'application/json',
          }, _params.headers),
        }),
      };

      return resolve(this.createRequest(parameters));
    });
  };
}
/*************************
 * interfaces
 ************************/

namespace InsightsForMedicalLiteratureServiceV1 {

  /** Options for the `InsightsForMedicalLiteratureServiceV1` constructor. */
  export interface Options extends UserOptions {

    /** The release date of the version of the API you want to use. Specify dates in YYYY-MM-DD format. */
    version: string;
  }

  /** An operation response. */
  export interface Response<T = any>  {
    result: T;
    status: number;
    statusText: string;
    headers: IncomingHttpHeaders;
  }

  /** The callback for a service request. */
  export type Callback<T> = (error: any, response?: Response<T>) => void;

  /** The body of a service request that returns no response data. */
  export interface Empty { }

  /** A standard JS object, defined to avoid the limitations of `Object` and `object` */
  export interface JsonObject {
    [key: string]: any;
  }

  /*************************
   * request interfaces
   ************************/

  /** Parameters for the `getDocuments` operation. */
  export interface GetDocumentsParams {
    /** Corpus name. */
    corpus: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `addCorpusDocument` operation. */
  export interface AddCorpusDocumentParams {
    /** Corpus name. */
    corpus: string;
    /** JSON based document for enrichment. */
    document?: JsonObject;
    /** Annotator for clincial data url. */
    acdUrl?: string;
    /** Security key. */
    apiKey?: string;
    /** Enrichment flow identifier. */
    flowId?: string;
    /** Cloud access token. */
    accessToken?: string;
    /** URLs and API keys for custom annotators. */
    otherAnnotators?: JsonObject[];
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `getDocumentInfo` operation. */
  export interface GetDocumentInfoParams {
    /** Corpus name. */
    corpus: string;
    /** Document ID. */
    documentId: string;
    /** Verbose output. If true, text for all document sections is returned. */
    verbose?: boolean;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `getDocumentAnnotations` operation. */
  export interface GetDocumentAnnotationsParams {
    /** Corpus name. */
    corpus: string;
    /** Document ID. */
    documentId: string;
    /** Document section to annotate. (e.g., title, abstract, body... */
    documentSection: string;
    /** Concepts to show.  Defaults to all concepts. */
    cuis?: string[];
    /** Include document text. */
    includeText?: boolean;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `getDocumentCategories` operation. */
  export interface GetDocumentCategoriesParams {
    /** Corpus name. */
    corpus: string;
    /** Document ID. */
    documentId: string;
    /** HTML tag used to highlight concepts found in the text.  Default is '&ltb&gt'. */
    highlightTagBegin?: string;
    /** HTML tag used to highlight concepts found in the text.  Default is '&lt/b&gt'. */
    highlightTagEnd?: string;
    /** Select concepts belonging to these semantic types to return. Semantic types for the corpus can be found
     *  using the /v1/corpora/{corpus}/types method.Defaults to 'all'.
     */
    types?: string[];
    /** Select concepts belonging to disorders, drugs or genes. */
    category?: GetDocumentCategoriesConstants.Category | string;
    /** Only return negated concepts?. */
    onlyNegatedConcepts?: boolean;
    /** Comma separated list of fields to return:  passages, annotations, highlightedTitle, highlightedAbstract,
     *  highlightedBody, highlightedSections.
     */
    fields?: string;
    /** Limit the number of passages per search concept (1 to 250).  Default is 50. */
    limit?: number;
    headers?: OutgoingHttpHeaders;
  }

  /** Constants for the `getDocumentCategories` operation. */
  export namespace GetDocumentCategoriesConstants {
    /** Select concepts belonging to disorders, drugs or genes. */
    export enum Category {
      DISORDERS = 'disorders',
      DRUGS = 'drugs',
      GENES = 'genes',
    }
  }

  /** Parameters for the `getDocumentMultipleCategories` operation. */
  export interface GetDocumentMultipleCategoriesParams {
    /** Corpus name. */
    corpus: string;
    /** Document ID. */
    documentId: string;
    /** List of document categories. */
    categories?: JsonObject;
    /** HTML tag used to highlight concepts found in the text.  Default is '&ltb&gt'. */
    highlightTagBegin?: string;
    /** HTML tag used to highlight concepts found in the text.  Default is '&lt/b&gt'. */
    highlightTagEnd?: string;
    /** Comma separated list of fields to return:  passages, annotations, highlightedTitle, highlightedAbstract,
     *  highlightedBody, highlightedSections.
     */
    fields?: string;
    /** Limit the number of passages per search concept (1 to 250).  Default is 50. */
    limit?: number;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `getSearchMatches` operation. */
  export interface GetSearchMatchesParams {
    /** Corpus name. */
    corpus: string;
    /** Document ID (e.g, 7014026). */
    documentId: string;
    /** Minimum score .0 to 1.0. */
    minScore: number;
    /** cui[,rank,[type]] - Example: "C0030567,10". The rank is an optional value from 0 to 10 (defalut is 10).
     *  Special rank values: 0=omit, 10=require. Related concepts can also be included by appending, '-PAR' (parents),
     *  '-CHD' (children), or '-SIB' (siblings) to the CUI (eg., to include all children of C0030567: 'C0030567-CHD')).
     *  The type may explicitly select a semanic type for a concept.  If no type is specified, a default type is
     *  selected.
     */
    cuis?: string[];
    /** Case insensitive text searches. */
    text?: string[];
    /** Highlight all text spans matching these semantic types.  Semantic types for the corpus can be found using
     *  the /v1/corpora/{corpus}/types method.
     */
    types?: string[];
    /** Limit the number of matching passages per search concept/search term (1 to 250).  Default is 50. */
    limit?: number;
    /** HTML tag used to highlight search concepts found in the text.  Default is '&ltb&gt'. */
    searchTagBegin?: string;
    /** HTML tag used to highlight search concepts found in the text.  Default is '&lt/b&gt'. */
    searchTagEnd?: string;
    /** HTML tag used to highlight related concepts found in the text. */
    relatedTagBegin?: string;
    /** HTML tag used to highlight related concepts found in the text. */
    relatedTagEnd?: string;
    /** Comma separated list of fields to return:  passages, annotations, highlightedTitle, highlightedAbstract,
     *  highlightedBody, highlightedSections.
     */
    fields?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `getHealthCheckStatus` operation. */
  export interface GetHealthCheckStatusParams {
    /** The type of the response: application/json or application/xml. */
    accept?: GetHealthCheckStatusConstants.Accept | string;
    /** Override response format. */
    format?: GetHealthCheckStatusConstants.Format | string;
    headers?: OutgoingHttpHeaders;
  }

  /** Constants for the `getHealthCheckStatus` operation. */
  export namespace GetHealthCheckStatusConstants {
    /** The type of the response: application/json or application/xml. */
    export enum Accept {
      APPLICATION_JSON = 'application/json',
      APPLICATION_XML = 'application/xml',
    }
    /** Override response format. */
    export enum Format {
      JSON = 'json',
      XML = 'xml',
    }
  }

  /** Parameters for the `search` operation. */
  export interface SearchParams {
    /** Corpus name. */
    corpus: string;
    /** Define the query using JSON.<script>function setSearchApiBody(e,file) {$.get(file).done(function(text) {
     *  $(e.target).closest('td').prev('td').find('textarea').val(text);})}</script><p>Try sample queries:<ul
     *  style='margin-top: 0; list-style:none; padding-left:0;'><li><span style='text-decoration: underline; cursor:
     *  pointer;' onclick='setSearchApiBody(event, "conceptSearch.json")'><a>Concept Search</a></span></li><li><span
     *  style='text-decoration: underline; cursor: pointer;' onclick='setSearchApiBody(event,
     *  "conceptsAggregation.json")'><a>Concepts Aggregation</a></span></li><li><span style='text-decoration: underline;
     *  cursor: pointer;' onclick='setSearchApiBody(event, "keywordSearch.json")'><a>Keyword
     *  Search</a></span></li><li><span style='text-decoration: underline; cursor: pointer;'
     *  onclick='setSearchApiBody(event, "attributeSearch.json")'><a>Attribute Search</a></span></li><li><span
     *  style='text-decoration: underline; cursor: pointer;' onclick='setSearchApiBody(event, "types.json")'><a>Get
     *  Semantic Types</a></span></li><li><span style='text-decoration: underline; cursor: pointer;'
     *  onclick='setSearchApiBody(event, "attributes.json")'><a>Attributes</a></span></li><li><span
     *  style='text-decoration: underline; cursor: pointer;' onclick='setSearchApiBody(event,
     *  "attributeTypeahead.json")'><a>Attribute Typeahead</a></span></li><li><span style='text-decoration: underline;
     *  cursor: pointer;' onclick='setSearchApiBody(event, "conceptTypeahead.json")'><a>Concept
     *  Typeahead</a></span></li><li><span style='text-decoration: underline; cursor: pointer;'
     *  onclick='setSearchApiBody(event, "passages.json")'><a>Passages</a></span></li><li><span style='text-decoration:
     *  underline; cursor: pointer;' onclick='setSearchApiBody(event, "authorSearch.json")'><a>Author
     *  Search</a></span></li><li><span style='text-decoration: underline; cursor: pointer;'
     *  onclick='setSearchApiBody(event, "authorsAggregation.json")'><a>Author Aggregation</a></span></li><li><span
     *  style='text-decoration: underline; cursor: pointer;' onclick='setSearchApiBody(event,
     *  "authorTypeahead.json")'><a>Author Typeahead</a></span></li><li><span style='text-decoration: underline; cursor:
     *  pointer;' onclick='setSearchApiBody(event, "titleTypeahead.json")'><a>Title Typeahead</a></span></li><li><span
     *  style='text-decoration: underline; cursor: pointer;' onclick='setSearchApiBody(event,
     *  "dateHistogram.json")'><a>Date Histogram</a></span></li><li><span style='text-decoration: underline; cursor:
     *  pointer;' onclick='setSearchApiBody(event, "dateRange.json")'><a>Date Range</a></span></li><li><span
     *  style='text-decoration: underline; cursor: pointer;' onclick='setSearchApiBody(event,
     *  "advancedSearch.json")'><a>Advanced Search</a></span></li></ul>.
     */
    body: string;
    /** Verbose output. */
    verbose?: boolean;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `getFields` operation. */
  export interface GetFieldsParams {
    /** Corpus name. */
    corpus: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `typeahead` operation. */
  export interface TypeaheadParams {
    /** Comma-separated corpora names. */
    corpus: string;
    /** Query string. */
    query: string;
    /** Include suggestions belonging to the selected ontology(ies). */
    ontologies?: TypeaheadConstants.Ontologies[] | string[];
    /** Include or exclude suggestions belonging to one of these types.  Types can be found using
     *  /v1/corpora/{corpus}/types method.  Defaults to all.
     */
    types?: string[];
    /** Select concepts belonging to disorders, drugs or genes. */
    category?: TypeaheadConstants.Category | string;
    /** Verbose output.  Include hit counts and relationship counts for each concept. */
    verbose?: boolean;
    /** Maximum number of suggestions to return. */
    limit?: number;
    /** Maximum hit (document) count for suggested concepts. Default is 500000.  High hit count concepts tend to be
     *  very broad (e.g, Disease) and result in longer search times.
     */
    maxHitCount?: number;
    /** Remove duplicate concepts. */
    noDuplicates?: boolean;
    headers?: OutgoingHttpHeaders;
  }

  /** Constants for the `typeahead` operation. */
  export namespace TypeaheadConstants {
    /** Include suggestions belonging to the selected ontology(ies). */
    export enum Ontologies {
      CONCEPTS = 'concepts',
      MESH = 'mesh',
    }
    /** Select concepts belonging to disorders, drugs or genes. */
    export enum Category {
      DISORDERS = 'disorders',
      DRUGS = 'drugs',
      GENES = 'genes',
    }
  }

  /** Parameters for the `getCorporaConfig` operation. */
  export interface GetCorporaConfigParams {
    /** Verbose output.  Default verbose = false. */
    verbose?: boolean;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `setCorpusSchema` operation. */
  export interface SetCorpusSchemaParams {
    /** Input and Output field names. */
    enrichmentTargets?: JsonObject[];
    /** Metadata field names. */
    metadataFields?: JsonObject[];
    /** Corpus name. */
    corpusName?: string;
    /** Reference indices. */
    references?: JsonObject;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `deleteCorpusSchema` operation. */
  export interface DeleteCorpusSchemaParams {
    /** corpus schema. */
    instance: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `setCorpusConfig` operation. */
  export interface SetCorpusConfigParams {
    /** Repository connection userid. */
    userName?: string;
    /** Repository connection password. */
    password?: string;
    /** Repository connection URI. */
    corpusUri?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `monitorCorpus` operation. */
  export interface MonitorCorpusParams {
    /** Apikey with read only permissions for monitoring. */
    apikey: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `enableCorpusSearchTracking` operation. */
  export interface EnableCorpusSearchTrackingParams {
    /** Enable corpus read event tracking.  Default is false. */
    enableTracking?: boolean;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `getCorpusConfig` operation. */
  export interface GetCorpusConfigParams {
    /** Corpus name. */
    corpus: string;
    /** Verbose output.  Default verbose = false. */
    verbose?: boolean;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `getConcepts` operation. */
  export interface GetConceptsParams {
    /** Corpus name. */
    corpus: string;
    /** Select concepts with the specified CUIs. Each cui is assumed to be from UMLS unless an ontology is
     *  explicitly specified using the syntax [ontology:]cui, e.g., 'concepts:C0018787'.
     */
    cuis?: string[];
    /** Select concepts with the specified preferred names. Each preferred name is assumed to be from UMLS unless an
     *  ontology is explicitly specified using the syntax [ontology:::]preferred_name, e.g., 'concepts:::HEART'.
     */
    preferredNames?: string[];
    /** Select all concepts having these surface forms. The match is case insensitive. Each surface form is matched
     *  against UMLS unless an ontology is explicitly specified using the syntax [ontology:::]surface_form, e.g.,
     *  'concepts:::heart attack'.
     */
    surfaceForms?: string[];
    /** Select all concepts having these attributes. The match is case insensitive. */
    attributes?: string[];
    /** Verbose output.  Default is false. */
    verbose?: boolean;
    /** Sort by hitCount (in document count).  Set to ascending order (_sort=+hitCount) or descending order
     *  (_sort=-hitCount).
     */
    sort?: string;
    /** Number of possible concepts to return. Default is 250. */
    limit?: number;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `addArtifact` operation. */
  export interface AddArtifactParams {
    /** Corpus name. */
    corpus: string;
    dictionaryEntry?: DictonaryEntry;
    attributeEntry?: AttributeEntry;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `getCuiInfo` operation. */
  export interface GetCuiInfoParams {
    /** Corpus name. */
    corpus: string;
    /** Preferred name or concept ID. */
    nameOrId: string;
    /** The ontology that defines the cui. */
    ontology?: string;
    /** Comma separated list of fields to return: preferredName, semanticTypes, surfaceForms, typeahead, variants,
     *  definition.  Defaults to all fields.
     */
    fields?: string;
    /** Generate JSON output that is compatible with a d3 tree layout.  Default is false. */
    treeLayout?: boolean;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `getHitCount` operation. */
  export interface GetHitCountParams {
    /** Corpus name. */
    corpus: string;
    /** Preferred name or concept ID. */
    nameOrId: string;
    /** The ontology that defines the cui. */
    ontology?: string;
    headers?: OutgoingHttpHeaders;
  }

  /** Parameters for the `getRelatedConcepts` operation. */
  export interface GetRelatedConceptsParams {
    /** Corpus name or null to show all ontology relationships. */
    corpus: string;
    /** Preferred name or concept ID. */
    nameOrId: string;
    /** Select the relationship to retrieve. */
    relationship: GetRelatedConceptsConstants.Relationship | string;
    /** The ontology that defines the cui. */
    ontology?: string;
    /** Select UMLS relationship attributes.  If null, all relationship attributes are returned. */
    relationshipAttributes?: string[];
    /** Select source vocabularies.  If null, concepts for all source vocabularies are returned. */
    sources?: string[];
    /** Recursively return parents, children, broader and narrower relations.  Default is false. */
    recursive?: boolean;
    /** Generate JSON output that is compatible with a d3 tree layout.  Default is true. */
    treeLayout?: boolean;
    /** Maximum depth.  Default is 3. */
    maxDepth?: number;
    headers?: OutgoingHttpHeaders;
  }

  /** Constants for the `getRelatedConcepts` operation. */
  export namespace GetRelatedConceptsConstants {
    /** Select the relationship to retrieve. */
    export enum Relationship {
      CHILDREN = 'children',
      PARENTS = 'parents',
      SIBLINGS = 'siblings',
      ALLOWEDQUALIFIER = 'allowedQualifier',
      QUALIFIEDBY = 'qualifiedBy',
      BROADER = 'broader',
      ALIKE = 'alike',
      NARROWER = 'narrower',
      OTHER = 'other',
      RELATEDUNSPECIFIED = 'relatedUnspecified',
      RELATED = 'related',
      SYNONYM = 'synonym',
      NOTRELATED = 'notRelated',
      CHD = 'chd',
      PAR = 'par',
      SIB = 'sib',
      AQ = 'aq',
      QB = 'qb',
      RB = 'rb',
      RL = 'rl',
      RN = 'rn',
      RO = 'ro',
      RU = 'ru',
      RQ = 'rq',
      SY = 'sy',
      XR = 'xr',
    }
  }

  /** Parameters for the `getSimilarConcepts` operation. */
  export interface GetSimilarConceptsParams {
    /** Corpus name. */
    corpus: string;
    /** Preferred name or concept ID. */
    nameOrId: string;
    /** Return similar concepts from any of these ontologites. */
    returnOntologies: string[];
    /** The ontology that defines the cui. */
    ontology?: string;
    /** Number of possible concepts to return. Default is 250. */
    limit?: number;
    headers?: OutgoingHttpHeaders;
  }

  /*************************
   * model interfaces
   ************************/

  /** AttributeEntry. */
  export interface AttributeEntry {
    attr_name?: string;
    data_type?: string;
    default_value?: string;
    description?: string;
    display_name?: string;
    doc_id?: string;
    field_values?: string[];
    maximum_value?: string;
    minimum_value?: string;
    multi_value?: boolean;
    units?: string;
    valueType?: string;
    possible_values?: PossbileValues[];
  }

  /** BoolOperand. */
  export interface BoolOperand {
    operandName?: string;
  }

  /** DictonaryEntry. */
  export interface DictonaryEntry {
    children?: string[];
    cui?: string;
    definition?: string[];
    parents?: string[];
    preferredName?: string;
    semtypes?: string[];
    siblings?: string[];
    surfaceForms?: string[];
    variants?: string[];
    vocab?: string;
    related?: string[];
    source?: string;
    source_version?: string;
  }

  /** GetDocumentInfoResponse. */
  export interface GetDocumentInfoResponse {
    /** GetDocumentInfoResponse accepts additional properties. */
    [propName: string]: any;
  }

  /** Object representing repository message. */
  export interface Message {
    /** Message semantic type. */
    messageType?: string;
    /** Message link. */
    url?: string;
    /** Message request. */
    request?: JsonObject;
    /** Request headers. */
    headers?: string[];
    /** Message status. */
    status?: number;
    /** Message response. */
    response?: JsonObject;
  }

  /** MetadataFields. */
  export interface MetadataFields {
    /** Corpus name. */
    corpus?: string;
    /** Corpus description. */
    corpusDescription?: string;
    /** Metadata fields. */
    fields?: JsonObject;
  }

  /** PassagesModel. */
  export interface PassagesModel {
    /** Document passages. */
    allPassages?: Passage[];
    /** Passagess by search term. */
    passagesBySearchTerm?: JsonObject;
  }

  /** PossbileValues. */
  export interface PossbileValues {
    displayValue?: string;
    value?: string;
  }

  /** RankedDocLinks. */
  export interface RankedDocLinks {
    /** Links for search matches. */
    hrefSearchMatches?: string;
    /** Links for categorized search matches. */
    hrefCategories?: string;
  }

  /** StringBuilder. */
  export interface StringBuilder {
  }

  /** Model for field aggregations. */
  export interface AggregationModel {
    /** Name of the aggregation. */
    name?: string;
    /** Corpus frequency of the aggregation. */
    documentCount?: number;
  }

  /** Model for congntive asset annotations. */
  export interface AnnotationModel {
    /** Unique identifer of annotation. */
    uniqueId?: number;
    /** Source ontology of annotation. */
    ontology?: string;
    /** Document section for annotation. */
    section?: string;
    /** Ontology provide normalized name of annotation. */
    preferredName?: string;
    /** Ontology provided unique identifier of annotation. */
    cui?: string;
    /** Attribute identifier of annotation. */
    attributeId?: string;
    /** Qualifier for attribute annotation. */
    qualifiers?: string[];
    /** Ontology provided semantic type of annotation. */
    type?: string;
    /** Whether the annotation is a negated span. */
    negated?: boolean;
    /** Whether the annotation is a hypothetical span. */
    hypothetical?: boolean;
    /** Starting offset of annotation. */
    begin?: number;
    /** Ending offset of annotation. */
    end?: number;
    /** Relevancy score of annotation. */
    score?: number;
    timestamp?: number;
    features?: JsonObject;
    /** Number of times artifact is mentioned in the corpus. */
    hits?: number;
  }

  /** Model for ontology artifact. */
  export interface ArtifactModel {
    /** Ontology provided unique identifier for artifact. */
    cui?: string;
    /** Source ontology for artifact. */
    ontology?: string;
    /** Ontology provided normalized name for artifact. */
    preferredName?: string;
    /** Ontology provided alternative name for artifact. */
    alternativeName?: string;
    /** Ontology semantic type for artifact. */
    semanticType?: string;
    /** Search weight assigned to artifact. */
    rank?: number;
    /** Number of corpus documents artifact was found in. */
    hitCount?: number;
    /** Relevance score for artifact. */
    score?: number;
    /** List of artifact synonyms. */
    surfaceForms?: string[];
  }

  /** Object representing an attribute artifact. */
  export interface Attribute {
    /** Unique identifier for attribute artifact. */
    attributeId?: string;
    /** Display name for attribute artifact. */
    displayName?: string;
    /** Corpus frequency for attribute artifact. */
    count?: number;
  }

  /** Object representing repository response. */
  export interface Backend {
    /** Repository messages. */
    messages?: Message[];
  }

  /** Object representingn boolean operands search criteria. */
  export interface BooleanOperands {
    /** Boolean search condition. */
    boolExpression?: string;
    /** Ontology artifacts supporing boolean search condition. */
    boolOperands?: BoolOperand[];
  }

  /** Model representing ontology categories. */
  export interface CategoriesModel {
    /** License for corpus. */
    modelLicense?: string;
    highlightedTitle?: StringBuilder;
    highlightedAbstract?: StringBuilder;
    highlightedBody?: StringBuilder;
    /** Document sections with annotation tags. */
    highlightedSections?: JsonObject;
    /** Document passages with annotation tags. */
    passages?: JsonObject;
    /** List of document annotations. */
    annotations?: JsonObject;
  }

  /** Model representing common data across annotations. */
  export interface CommonDataModel {
    /** Object of all ontology artifacts found in the document. */
    unstructured?: UnstructuredModel[];
  }

  /** Object reprensting an ontology artifact. */
  export interface Concept {
    /** Ontology for artifact in search results. */
    ontology?: string;
    /** Unique identifier for ontolgoy artifact in search results. */
    cui?: string;
    /** Ontology defined semantic type for artifact in search results. */
    preferredName?: string;
    /** Ontology defined normalized name for artifact in search results. */
    alternativeName?: string;
    /** Ontology defined alternative name for artifact in search results. */
    semanticType?: string;
    /** Corpus frequency of artifact. */
    count?: number;
    /** Corpus frequency of artifact. */
    hitCount?: number;
    /** Relevancy score of artifact in search results. */
    score?: number;
    /** Corpus frequency count. */
    parents?: Count;
    /** Corpus frequency count. */
    children?: Count;
    /** Corpus frequency count. */
    siblings?: Count;
    /** Corpus frequency count. */
    related?: Count;
    /** Document identifiers for artifacts in search results. */
    documentIds?: string[];
    /** Source vocabulary of arttifact. */
    vocab?: string;
    /** Artifact properties. */
    properties?: string[];
  }

  /** Model representing ontology annotations. */
  export interface ConceptInfoModel {
    /** Ontology provided unique identifier for artifact. */
    cui?: string;
    /** Source onology of artifact. */
    ontology?: string;
    /** Ontology defined normalized name for artifact. */
    preferredName?: string;
    /** Ontology defined semanic types for artifact. */
    semanticTypes?: string[];
    /** Ontology defined synonyms for artifact. */
    surfaceForms?: string[];
    /** Ontology provided definition for artifact. */
    definition?: string;
    /** Whether the artifact has parent artifacts in the ontology. */
    hasParents?: boolean;
    /** Whether the artifact has child artifacts in the ontology. */
    hasChildren?: boolean;
    /** Whether the artifact has sibling artifacts in the ontology. */
    hasSiblings?: boolean;
  }

  /** List of ontolgoy artifacts. */
  export interface ConceptListModel {
    /** List of ontology artifacts. */
    concepts?: ArtifactModel[];
  }

  /** Model representing an ontology annotation. */
  export interface ConceptModel {
    /** Service generated unique identifier of ontology artifact. */
    uniqueId?: number;
    /** Document section where artifact was found. */
    section?: string;
    /** Ontology semantic type for artifact (if applicable). */
    type?: string;
    /** Staring offset of artifact in document section. */
    begin?: number;
    /** Ending offset of artifact in document section. */
    end?: number;
    /** Actual document section text artifact represents. */
    coveredText?: string;
    /** Ontology defined unique identifier of artifact. */
    cui?: string;
    /** Ontology defined normalized name of artifact. */
    preferredName?: string;
    /** Ontology providing the artifact. */
    source?: string;
    /** Whether span represented by artifact is negated. */
    negated?: boolean;
    /** Whether span represented by artifact is hypothetical. */
    hypothetical?: boolean;
    /** Time based offset of artifact in a video transcript (if applicable). */
    timestamp?: number;
    /** Identifier of attribute where artifact is defined (if applicable). */
    attributeId?: string;
    /** List of additional artifact features. */
    features?: JsonObject;
    /** Number of times artifact is mentioned in the corpus. */
    hits?: number;
  }

  /** Model presenting status of a submitted configuration request. */
  export interface ConfigurationStatusModel {
    /** The status of the submited request. */
    status?: string;
  }

  /** Model respresenting configured corpora. */
  export interface CorporaConfig {
    /** List of corpora found in the instance. */
    corpora?: CorpusModel[];
  }

  /** Object representing a configured corpus. */
  export interface CorpusModel {
    /** Name of the corpus. */
    corpusName?: string;
    /** Ontologies found in the corpus. */
    ontologies?: string[];
    /** Descriptive name of the corpus. */
    descriptiveName?: string;
    /** BVT status of the corpus. */
    bvt?: boolean;
    /** Repository location of the corpus. */
    elasticsearchIndex?: string;
  }

  /** Corpus frequency count. */
  export interface Count {
    /** Number of documents for artifact result. */
    count?: number;
    /** Number of documents for artifact result. */
    hits?: number;
  }

  /** Model representing ontology artifacts. */
  export interface DataModel {
    /** List of ontolgy artifacts found in the document. */
    concepts?: ConceptModel[];
    /** List of ontolgy attribute value artifacts found in the document. */
    attributeValues?: ConceptModel[];
    mesh?: ConceptModel[];
    text?: ConceptModel[];
  }

  /** Object representing a passage. */
  export interface EntryModel {
    /** Unique identifier of passage. */
    id?: string;
    /** Whether passage is a negated span. */
    negated?: boolean;
    /** List of sentences within passage. */
    sentences?: SentenceModel[];
  }

  /** Supported options for the field. */
  export interface FieldOptions {
    /** List of supported options. */
    supports?: string[];
  }

  /** histogram data. */
  export interface HistogramData {
    /** Date associated with result. */
    date?: string;
    /** Number of documents for date range result. */
    hits?: number;
  }

  /** Corpus frequency of artifact. */
  export interface HitCount {
    /** Corpus frequency of artifact. */
    hitCount?: number;
  }

  /** Object representing a match entry. */
  export interface MatchEntry {
    /** Whether match is a negated span. */
    negated?: boolean;
    /** Relevancy score of the match. */
    score?: number;
    /** List of sentences within the matched text. */
    sentences?: SentenceModel[];
    /** Unique identifier of the match. */
    id?: string;
  }

  /** Model for document metadata. */
  export interface MetadataModel {
    /** List of document fields in the corpus. */
    fields?: JsonObject;
    /** List of fields that where enriched. */
    sectionFieldNames?: string[];
    /** List of fields enriched with attributes. */
    attrSectionFieldNames?: string[];
    /** List of fields enriched with attribute qualifiers. */
    qualifierSectionFieldNames?: string[];
    /** List of fields with MeSH annotations. */
    meshSectionFieldNames?: string[];
    fieldIndexMap?: JsonObject;
  }

  /** Object representing a document passage. */
  export interface Passage {
    /** Document section for passage. */
    documentSection?: string;
    text?: StringBuilder;
    /** Timestamp of passage in video transcript. */
    timestamp?: number;
    /** Preferred name for highlighted text span. */
    preferredName?: string;
    /** Concept unique identifier for highlighted text span. */
    cui?: string;
    /** Concept hit count or mentions in the corpus. */
    hitCount?: number;
  }

  /** Object representing a document search result. */
  export interface RankedDocument {
    /** Document identifier. */
    documentId?: string;
    /** Document title. */
    title?: string;
    /** Additional document fields. */
    metadata?: JsonObject;
    /** Document section. */
    sectionName?: string;
    /** Document section identifier. */
    sectionId?: string;
    /** Document corpus. */
    corpus?: string;
    links?: RankedDocLinks;
    passages?: PassagesModel;
    /** Document annotations. */
    annotations?: JsonObject;
  }

  /** Model for concept ontology relation. */
  export interface RelatedConceptModel {
    /** Ontology provided unique identifier for artifact. */
    cui?: string;
    /** Source ontology for artifact. */
    ontology?: string;
    /** Ontology provided normalized name for artifact. */
    preferredName?: string;
    /** Ontology provided alternative name for artifact. */
    alternativeName?: string;
    /** Ontology semantic type for artifact. */
    semanticType?: string;
    /** Search weight assigned to artifact. */
    rank?: number;
    /** Number of corpus documents artifact was found in. */
    hitCount?: number;
    /** Relevance score for artifact. */
    score?: number;
    /** List of artifact synonyms. */
    surfaceForms?: string[];
    /** List of artifacts for the relation. */
    nextConcepts?: RelatedConceptModel[];
  }

  /** Model for concept ontology relations. */
  export interface RelatedConceptsModel {
    /** List of artifacts for the relation. */
    concepts?: RelatedConceptModel[];
  }

  /** Object representing a corpus search match. */
  export interface SearchMatchesModel {
    /** Unique identifier for matched document in corpus. */
    externalId?: string;
    /** Unique identifier for matched document in corpus. */
    documentId?: string;
    /** Unique identifier for matched document parent in corpus. */
    parentDocumentId?: string;
    /** Publication name for matched document in corpus. */
    publicationName?: string;
    /** Publication date for matched document in corpus. */
    publicationDate?: string;
    /** Publication URL for matched document in corpus. */
    publicationURL?: string;
    /** Authors of matched document in corpus. */
    authors?: string[];
    /** Title of matched document in corpus. */
    title?: string;
    /** Usage license for matched document in corpus. */
    medlineLicense?: string;
    /** Pubmed link for matched document in corpus. */
    hrefPubMed?: string;
    hrefPmc?: string;
    hrefDoi?: string;
    /** Link to PDF for matched document in corpus. */
    pdfUrl?: string;
    /** Link to sourc origin for matched document in corpus. */
    referenceUrl?: string;
    highlightedTitle?: StringBuilder;
    highlightedAbstract?: StringBuilder;
    highlightedBody?: StringBuilder;
    /** Matched document sections with annotation tags. */
    highlightedSections?: JsonObject;
    /** Matched document passages with annotation tags. */
    passages?: JsonObject;
    /** Matched document annotations. */
    annotations?: JsonObject;
  }

  /** Model for search criteria. */
  export interface SearchModel {
    /** Link. */
    href?: string;
    /** Page number. */
    pageNumber?: number;
    /** Search result limit. */
    get_limit?: number;
    /** Total number of search matches in the corpus. */
    totalDocumentCount?: number;
    /** Ontology artifact results from search. */
    concepts?: Concept[];
    /** Ontology semantic types. */
    types?: string[];
    /** Attribute artifact results from search. */
    attributes?: Attribute[];
    /** Type-ahead suggestion results in search. */
    typeahead?: Concept[];
    /** Aggregate result targets in search. */
    aggregations?: JsonObject;
    /** Date range of results from search. */
    dateHistograms?: JsonObject;
    /** Object representing repository response. */
    backend?: Backend;
    /** Search expression that includes all levels of criteria expression. */
    expandedQuery?: JsonObject;
    /** Object representingn boolean operands search criteria. */
    parsedBoolExpression?: BooleanOperands;
    /** Whether ontolgoy artifacts were provided in search conditions. */
    conceptsExist?: JsonObject;
    cursorId?: string;
    vocabs?: string[];
    /** Annotations returned for the document. */
    annotations?: JsonObject;
    metadata?: MetadataFields;
    /** Documents returned from search. */
    documents?: RankedDocument[];
    subQueries?: SearchModel[];
  }

  /** Object representing a document sentence. */
  export interface SentenceModel {
    /** Document section for sentence. */
    documentSection?: string;
    text?: StringBuilder;
    /** Starting sentence offset. */
    begin?: number;
    /** Ending sentence offset. */
    end?: number;
    /** Timestamp of sentence in video transcript. */
    timestamp?: number;
  }

  /** Object representing service runtime status. */
  export interface ServiceStatus {
    /** scurrent service state. */
    serviceState?: string;
    /** service state details. */
    stateDetails?: string;
  }

  /** Model representing unstructed text. */
  export interface UnstructuredModel {
    /** Text of the document. */
    text?: string;
    /** Model representing ontology artifacts. */
    data?: DataModel;
  }

}

export = InsightsForMedicalLiteratureServiceV1;
