import React from 'react';
import { graphql } from 'gatsby';
import { BLOCKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import styled from '@emotion/styled';
import Layout from './layout';
import WhiteContainer from '../components/white-container';
import Breadcrumb from '../components/breadcrumb';

const rendererOptions = ({ locale = 'en-US' }) => ({
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: ({ data }) => {
      // check for assets only
      if (data.target.sys.type !== 'Asset') return;

      // check for images only
      if (data.target.fields.file[locale].contentType.startsWith('image')) {
        return (
          <img
            src={data.target.fields.file[locale].url}
            alt={data.target.fields.title[locale]}
          />
        );
      }
    },
  },
});

const ArticleTitle = styled.h1`
  margin-bottom: 32px;

  color: #2a3039;
  font-weight: 700;
  font-size: 28px;
`;

const ArticleContentContainer = styled.section`
  padding: 32px 94px;

  color: #536171;
  line-height: 1.5;
  font-size: 16px;

  h1 {
    font-size: 32px;
  }
  h2 {
    font-size: 28px;
  }
  h3 {
    font-size: 24px;
  }
  h4 {
    font-size: 20px;
  }
  h5 {
    font-size: 16px;
  }
  h6 {
    font-size: 12px;
  }

  a {
    color: #3c80cf;
    text-decoration: none;

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }

  code {
    display: inline-block;
    padding: 2px 10px;

    background-color: #fafafa;
    border-radius: 3px;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    margin-left: 0;
    padding: 8px 0 8px 32px;

    line-height: 2;

    border-left: 5px solid #efefef;
  }

  @media screen and (max-width: 768px) {
    padding: 16px;
  }
`;

export default function Article(props) {
  const { article } = props.data;

  return (
    <Layout>
      <Breadcrumb
        paths={[
          { url: '/', name: 'All categories' },
          { url: `/${article.category.slug}/`, name: article.category.name },
          { name: article.title },
        ]}
      />

      <article>
        <ArticleTitle>{props.data.article.title}</ArticleTitle>

        <WhiteContainer>
          <ArticleContentContainer>
            {documentToReactComponents(
              props.data.article.body.json,
              rendererOptions({ locale: article.locale }),
            )}
          </ArticleContentContainer>
        </WhiteContainer>
      </article>
    </Layout>
  );
}

export const query = graphql`
  query Article($id: String) {
    article: contentfulArticle(id: { eq: $id }) {
      title
      slug
      body {
        json
      }
      category {
        slug
        name
      }
      locale: node_locale
    }
  }
`;
