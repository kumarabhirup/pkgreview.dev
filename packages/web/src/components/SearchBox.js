import React, { useState } from 'react'
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'
import { useApolloClient } from 'react-apollo'
import Downshift, { resetIdCounter } from 'downshift'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import { SearchBoxStyledComponent } from '../lib/styles/styled'

const SEARCH_PACKAGES_QUERY = gql`
  query SEARCH_PACKAGES_QUERY($searchString: String!) {
    searchPackage(searchString: $searchString) {
      name
      type
      version
      maintainers {
        username
      }
      rating
    }
  }
`

const Dropdown = styled.div`
  position: absolute;
  width: 100%;
  height: ${props => (props.packages.length < 6 ? 'auto' : '300px')};
  overflow: scroll;
  /* background: white; */
  border-top: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  z-index: 3 !important;
  ${props =>
    props.mobile
      ? 'box-shadow: 0px 0px 5px rgba(0,0,0,.3); border-radius: 6px;'
      : null};
  /* padding: 10px; */
`

const DropDownItem = styled.div`
  border-bottom: 1px solid gainsboro;
  background: ${props => (props.highlighted ? 'gainsboro' : 'white')};
  padding: 1rem;
  transition: all 0.2s;
  font-weight: bold;
  /* ${props => (props.highlighted ? 'padding-left: 2rem;' : null)}; */
  ${props => (props.highlighted ? 'color: black;' : null)}
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 3 !important;
  /* border-left: ${props => (props.mobile ? '6.5px' : '3px')} solid ${props =>
  props.highlighted ? 'gainsboro' : 'white'}; */
  img {
    margin-right: 10px;
  }
`

export default function SearchBox() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const apolloClient = useApolloClient()

  const onInputChange = debounce(async (event, client) => {
    if (event.target.value.length > 2) {
      setLoading(true)

      const res = await client.query({
        query: SEARCH_PACKAGES_QUERY,
        variables: { searchString: event.target.value },
      })

      if (res.data.searchPackage.length > 0) {
        setPackages(res.data.searchPackage)
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
  }, 400)

  const routeToPackage = packageData => {
    router.push(
      `/${packageData.type}/${encodeURIComponent(packageData.name).replace(
        '%40',
        '@'
      )}`
    )
  }

  resetIdCounter()

  return (
    <Downshift
      onChange={routeToPackage}
      itemToString={packageData =>
        packageData === null ? '' : packageData.name
      }
    >
      {({
        getRootProps,
        getInputProps,
        getItemProps,
        getLabelProps,
        isOpen,
        inputValue,
        highlightedIndex,
      }) => (
        <SearchBoxStyledComponent
          {...getRootProps({})}
          action="#"
          onSubmit={e => e.preventDefault()}
          className="wrapper block fixed"
        >
          <input
            {...getInputProps({
              type: 'search',
              placeholder: '🍹 Search a library/package',
              required: 'required',
              id: 'search',
              className: `${loading && 'loading'}`,
              onChange: event => {
                event.persist()
                onInputChange(event, apolloClient)
              },
            })}
          />

          {isOpen ? (
            <Dropdown packages={packages}>
              {packages.map((packageData, index) => (
                <DropDownItem
                  {...getItemProps({ item: packageData })}
                  key={packageData.name}
                  highlighted={index === highlightedIndex}
                  className={`block ${
                    index === highlightedIndex ? 'accent' : ''
                  }`}
                >
                  {packageData.type === 'npm' && (
                    <img
                      width="50"
                      src="https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg"
                      alt={packageData.name}
                    />
                  )}{' '}
                  <span className="underline">{packageData.name}</span>
                  &nbsp;−&nbsp;
                  <span>v{packageData.version}</span>
                </DropDownItem>
              ))}
            </Dropdown>
          ) : null}
        </SearchBoxStyledComponent>
      )}
    </Downshift>
  )
}
