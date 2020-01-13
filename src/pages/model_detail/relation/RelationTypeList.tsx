import React, { useState } from 'react'
import { RelationType } from '../../../generated/globalTypes'
import { css } from 'emotion'
import { colors } from 'react-atomicus'

const RelationTypeList = ({
  onSelect,
}: {
  onSelect: (relationType: RelationType) => void
}) => {
  const [selectedRelation, setSelectedRelation] = useState(
    RelationType.ONE_TO_ONE
  )
  const selectedStyle = css`
    border-left: 3px solid ${colors.blue500};
    color: ${colors.grey800};
    font-size: 1.6rem;
    border-radius: 3px;
  `
  const label = (relationType: RelationType) => {
    switch (relationType) {
      case RelationType.ONE_TO_ONE:
        return 'One to one'
      case RelationType.ONE_TO_MANY:
        return 'One To many'
      case RelationType.MANY_TO_ONE:
        return 'Many to one'
      case RelationType.MANY_TO_MANY:
        return 'Many to many'
    }
  }
  return (
    <div>
      <ul
        className={css`
          width: 19.2rem;
          list-style: none;
          font-size: 1.4rem;
          border-radius: 3px;
          border-top: 1px solid ${colors.grey200};

          & > li {
            padding: 1.2rem 0.8rem;
            text-align: center;
          }
        `}
      >
        {Object.keys(RelationType)
          .filter(r => r !== RelationType.ONE_TO_ONE_DIRECTIVE)
          .map(relationType => (
            <li
              key={relationType}
              onClick={() => {
                setSelectedRelation(relationType as RelationType)
                onSelect(relationType as RelationType)
              }}
              className={css`
                cursor: pointer;
                color: ${colors.grey200};
                border: 1px solid ${colors.grey200};
                border-top: none;
                ${selectedRelation === relationType && selectedStyle}
              `}
            >
              {label(relationType as RelationType)}
            </li>
          ))}
      </ul>
    </div>
  )
}

export { RelationTypeList }
