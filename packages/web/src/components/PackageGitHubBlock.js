import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import Block from './Block'
import { Grid } from '../lib/styles/styled'
import useGithub from './hooks/useGithub'
import formatNumber from '../lib/formatNumber'

export default function PackageGitHubBlock({ githubRepoUrl }) {
  const [
    { openIssuesNumber, starGazersNumber, lastUpdated, forksNumber },
    { loading, error },
  ] = useGithub(githubRepoUrl)

  return (
    <Block>
      <>
        {(() => {
          if (loading) return <h1>Loading...</h1>

          if (error) return <h1>GitHub data insuffiecient</h1>

          return (
            <>
              <h1>GitHub Stats</h1>

              <Grid elementWidth="200px">
                <a
                  href={`${githubRepoUrl}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <article className="block accent">
                    <h2 style={{ lineHeight: '0px' }}>Open Issues</h2>
                    <img
                      width="100"
                      src="https://issues.martingalovic.com/logo.png"
                      alt="package"
                      loading="lazy"
                      style={{ marginTop: '3px' }}
                    />
                    <h2>{formatNumber(openIssuesNumber)}</h2>
                  </article>
                </a>

                <a
                  href={`${githubRepoUrl}/stargazers`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <article className="block accent">
                    <h2 style={{ lineHeight: '0px' }}>Star Gazers</h2>
                    <img
                      width="100"
                      src="https://avatars2.githubusercontent.com/u/26615225?s=400&v=4"
                      alt="package"
                      loading="lazy"
                      style={{ marginTop: '3px' }}
                    />
                    <h2>{formatNumber(starGazersNumber)}</h2>
                  </article>
                </a>

                <a
                  href={githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <article className="block accent">
                    <h2 style={{ lineHeight: '0px' }}>Last Updated</h2>
                    <img
                      width="100"
                      src="https://i.ibb.co/h9nQD3t/git-commit-512.png"
                      alt="package"
                      loading="lazy"
                      style={{ marginTop: '3px' }}
                    />
                    <h2>{moment(lastUpdated).fromNow()}</h2>
                  </article>
                </a>

                <a
                  href={`${githubRepoUrl}/network/members`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <article className="block accent">
                    <h2 style={{ lineHeight: '0px' }}>Forks</h2>
                    <img
                      width="100"
                      src="https://greasyfork.org/en/forum/uploads/FileUpload/df/f87899bf1034cd4933c374b02eb5ac.png"
                      alt="package"
                      loading="lazy"
                      style={{ marginTop: '3px' }}
                    />
                    <h2>{formatNumber(forksNumber)}</h2>
                  </article>
                </a>
              </Grid>
            </>
          )
        })()}
      </>
    </Block>
  )
}

PackageGitHubBlock.propTypes = {
  githubRepoUrl: PropTypes.string.isRequired,
}
