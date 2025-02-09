/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Spinner from '@js/components/Spinner';
import HTML from '@mapstore/framework/components/I18N/HTML';
import FaIcon from '@js/components/FaIcon';
import ResourceCard from '@js/components/ResourceCard';
import useInfiniteScroll from '@js/hooks/useInfiniteScroll';
import {getResourceStatuses} from '@js/utils/ResourceUtils';
import MainLoader from '@js/components/MainLoader';

const Cards = ({
    resources,
    formatHref,
    isCardActive,
    buildHrefByTemplate,
    options,
    downloading,
    getDetailHref,
    cardLayoutStyle,
    children
}) => {

    return (
        <ul
            className={`gn-card-list gn-cards-type-${cardLayoutStyle}`}
        >
            {resources.map((resource) => {
                const { isProcessing } = getResourceStatuses(resource);
                // enable allowedOptions (menu cards)
                const allowedOptions =  !isProcessing ? options : [];
                return (
                    <li
                        key={resource.pk2 || resource.pk} // pk2 exists on clones to avoid duplicate keys
                    >
                        <ResourceCard
                            active={isCardActive(resource)}
                            data={resource}
                            formatHref={formatHref}
                            options={allowedOptions}
                            buildHrefByTemplate={buildHrefByTemplate}
                            layoutCardsStyle={cardLayoutStyle}
                            loading={isProcessing}
                            readOnly={isProcessing}
                            downloading={downloading?.find((download) => download.pk === resource.pk) ? true : false}
                            getDetailHref={getDetailHref}
                        />
                    </li>
                );
            })}
            {children}
        </ul>
    );
};

const InfiniteScrollCardGrid = ({
    resources,
    loading,
    page,
    isNextPageAvailable,
    onLoad,
    formatHref,
    isCardActive,
    containerStyle,
    header,
    cardOptions,
    messageId,
    children,
    buildHrefByTemplate,
    scrollContainer,
    downloading,
    getDetailHref,
    cardLayoutStyle
}) => {

    useInfiniteScroll({
        scrollContainer: scrollContainer,
        shouldScroll: () => !loading && isNextPageAvailable,
        onLoad: () => {
            onLoad(page + 1);
        }
    });

    const hasResources = resources?.length > 0;

    return (
        <div className="gn-card-grid">
            <div className="gn-card-grid-container" style={containerStyle}>
                {header}
                {children}
                {messageId && <div className="gn-card-grid-message">
                    <h1><HTML msgId={`gnhome.${messageId}Title`}/></h1>
                    <p>
                        <HTML msgId={`gnhome.${messageId}Content`}/>
                    </p>
                </div>}
                <Cards
                    resources={resources}
                    formatHref={formatHref}
                    getDetailHref={getDetailHref}
                    isCardActive={isCardActive}
                    options={cardOptions}
                    buildHrefByTemplate={buildHrefByTemplate}
                    downloading={downloading}
                    cardLayoutStyle={cardLayoutStyle}
                />
                <div className="gn-card-grid-pagination">
                    {loading && <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>}
                    {hasResources && !isNextPageAvailable && !loading && <FaIcon name="dot-circle-o" />}
                </div>
            </div>
        </div>
    );
};

const FixedCardGrid = ({
    resources,
    formatHref,
    isCardActive,
    containerStyle,
    header,
    cardOptions,
    messageId,
    children,
    buildHrefByTemplate,
    downloading,
    onSelect,
    footer,
    getDetailHref,
    cardLayoutStyle,
    loading
}) => {
    return (
        <div className="gn-card-grid">
            <div className="gn-card-grid-container" style={containerStyle}>
                {header}
                {children}
                {messageId && <div className="gn-card-grid-message">
                    <h1><HTML msgId={`gnhome.${messageId}Title`}/></h1>
                    <p>
                        <HTML msgId={`gnhome.${messageId}Content`}/>
                    </p>
                </div>}
                <Cards
                    resources={resources}
                    formatHref={formatHref}
                    getDetailHref={getDetailHref}
                    isCardActive={isCardActive}
                    options={cardOptions}
                    buildHrefByTemplate={buildHrefByTemplate}
                    downloading={downloading}
                    onSelect={onSelect}
                    cardLayoutStyle={cardLayoutStyle}
                >
                    {loading && resources.length > 0 ? <MainLoader className="gn-cards-loader"/> : null}
                </Cards>
                {footer}
            </div>
        </div>
    );
};

const CardGrid = ({ fixed, ...props }) => {
    return fixed ? <FixedCardGrid {...props}/> : <InfiniteScrollCardGrid {...props}/>;
};

CardGrid.defaultProps = {
    page: 1,
    resources: [],
    onLoad: () => { },
    isNextPageAvailable: false,
    loading: false,
    formatHref: () => '#',
    isCardActive: () => false
};

export default CardGrid;
