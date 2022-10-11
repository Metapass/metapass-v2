export type MetapassProgram = {
  version: '0.1.0';
  name: 'metapass_program';
  instructions: [
    {
      name: 'initializeHost';
      accounts: [
        {
          name: 'eventHostAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'displayName';
          type: 'string';
        },
        {
          name: 'profileImg';
          type: 'string';
        },
      ];
    },
    {
      name: 'initializeEvent';
      accounts: [
        {
          name: 'eventAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'eventHostAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'createEventInfo';
          type: {
            defined: 'CreateEventInput';
          };
        },
      ];
    },
    {
      name: 'mintTicket';
      accounts: [
        {
          name: 'mintAuthority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'eventAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'mint';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'metadata';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenMetadataProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'payer';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'masterEdition';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'eventHost';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'eventHostKey';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'adminAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'adminKey';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'customSplToken';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'customSplTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'senderCustomSplTokenAta';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'hostCustomSplTokenAta';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'adminCustomTokenAta';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'uri';
          type: 'string';
        },
      ];
    },
    {
      name: 'initializeAdmin';
      accounts: [
        {
          name: 'adminAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'adminAuthority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'admins';
          type: {
            vec: 'publicKey';
          };
        },
      ];
    },
    {
      name: 'addPartners';
      accounts: [
        {
          name: 'adminAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'adminAuthority';
          isMut: true;
          isSigner: true;
        },
      ];
      args: [
        {
          name: 'partner';
          type: 'publicKey';
        },
      ];
    },
    {
      name: 'removePartner';
      accounts: [
        {
          name: 'adminAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'adminAuthority';
          isMut: true;
          isSigner: true;
        },
      ];
      args: [
        {
          name: 'address';
          type: 'publicKey';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'eventAccount';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'title';
            type: 'string';
          },
          {
            name: 'description';
            type: 'string';
          },
          {
            name: 'uri';
            type: 'string';
          },
          {
            name: 'link';
            type: 'string';
          },
          {
            name: 'fee';
            type: 'u64';
          },
          {
            name: 'seats';
            type: 'u64';
          },
          {
            name: 'occupiedSeats';
            type: 'u64';
          },
          {
            name: 'date';
            type: 'string';
          },
          {
            name: 'collection';
            type: 'publicKey';
          },
          {
            name: 'venue';
            type: 'string';
          },
          {
            name: 'authority';
            type: 'publicKey';
          },
          {
            name: 'creators';
            type: {
              vec: 'publicKey';
            };
          },
          {
            name: 'eventHost';
            type: {
              defined: 'EventHost';
            };
          },
          {
            name: 'eventNonce';
            type: 'u64';
          },
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'isCutPayedByCreator';
            type: 'bool';
          },
          {
            name: 'isCustomSplToken';
            type: 'bool';
          },
          {
            name: 'customSplToken';
            type: 'publicKey';
          },
        ];
      };
    },
    {
      name: 'eventHostAccount';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'eventHostStruct';
            type: {
              defined: 'EventHost';
            };
          },
        ];
      };
    },
    {
      name: 'adminAccount';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'admins';
            type: {
              vec: 'publicKey';
            };
          },
          {
            name: 'bump';
            type: 'u8';
          },
          {
            name: 'authority';
            type: 'publicKey';
          },
          {
            name: 'verifiedPartners';
            type: {
              vec: 'publicKey';
            };
          },
        ];
      };
    },
  ];
  types: [
    {
      name: 'EventHost';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'eventsCreated';
            type: {
              vec: 'publicKey';
            };
          },
          {
            name: 'displayName';
            type: 'string';
          },
          {
            name: 'pubKey';
            type: 'publicKey';
          },
          {
            name: 'profileImage';
            type: 'string';
          },
          {
            name: 'eventCount';
            type: 'u64';
          },
          {
            name: 'bump';
            type: 'u8';
          },
        ];
      };
    },
    {
      name: 'CreateEventInput';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'title';
            type: 'string';
          },
          {
            name: 'description';
            type: 'string';
          },
          {
            name: 'uri';
            type: 'string';
          },
          {
            name: 'link';
            type: 'string';
          },
          {
            name: 'fee';
            type: 'u64';
          },
          {
            name: 'seats';
            type: 'u64';
          },
          {
            name: 'date';
            type: 'string';
          },
          {
            name: 'venue';
            type: 'string';
          },
          {
            name: 'isCutPayedByCreator';
            type: 'bool';
          },
          {
            name: 'isCustomSplToken';
            type: 'bool';
          },
          {
            name: 'customSplToken';
            type: 'publicKey';
          },
        ];
      };
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'InvalidCustomSplToken';
      msg: 'Custom SPL Token doesnt match with Host provided token';
    },
    {
      code: 6001;
      name: 'SignerNotAdmin';
      msg: 'The Signer of this transaction is not the admin';
    },
    {
      code: 6002;
      name: 'DataNotUpdated';
      msg: 'data not updated';
    },
  ];
};

export const IDL: MetapassProgram = {
  version: '0.1.0',
  name: 'metapass_program',
  instructions: [
    {
      name: 'initializeHost',
      accounts: [
        {
          name: 'eventHostAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'displayName',
          type: 'string',
        },
        {
          name: 'profileImg',
          type: 'string',
        },
      ],
    },
    {
      name: 'initializeEvent',
      accounts: [
        {
          name: 'eventAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'eventHostAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'createEventInfo',
          type: {
            defined: 'CreateEventInput',
          },
        },
      ],
    },
    {
      name: 'mintTicket',
      accounts: [
        {
          name: 'mintAuthority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'eventAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'mint',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'metadata',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenMetadataProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'masterEdition',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'eventHost',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'eventHostKey',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'adminAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'adminKey',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'customSplToken',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'customSplTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'senderCustomSplTokenAta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'hostCustomSplTokenAta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'adminCustomTokenAta',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'uri',
          type: 'string',
        },
      ],
    },
    {
      name: 'initializeAdmin',
      accounts: [
        {
          name: 'adminAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'adminAuthority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'admins',
          type: {
            vec: 'publicKey',
          },
        },
      ],
    },
    {
      name: 'addPartners',
      accounts: [
        {
          name: 'adminAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'adminAuthority',
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'partner',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'removePartner',
      accounts: [
        {
          name: 'adminAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'adminAuthority',
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'address',
          type: 'publicKey',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'eventAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'title',
            type: 'string',
          },
          {
            name: 'description',
            type: 'string',
          },
          {
            name: 'uri',
            type: 'string',
          },
          {
            name: 'link',
            type: 'string',
          },
          {
            name: 'fee',
            type: 'u64',
          },
          {
            name: 'seats',
            type: 'u64',
          },
          {
            name: 'occupiedSeats',
            type: 'u64',
          },
          {
            name: 'date',
            type: 'string',
          },
          {
            name: 'collection',
            type: 'publicKey',
          },
          {
            name: 'venue',
            type: 'string',
          },
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'creators',
            type: {
              vec: 'publicKey',
            },
          },
          {
            name: 'eventHost',
            type: {
              defined: 'EventHost',
            },
          },
          {
            name: 'eventNonce',
            type: 'u64',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'isCutPayedByCreator',
            type: 'bool',
          },
          {
            name: 'isCustomSplToken',
            type: 'bool',
          },
          {
            name: 'customSplToken',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'eventHostAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'eventHostStruct',
            type: {
              defined: 'EventHost',
            },
          },
        ],
      },
    },
    {
      name: 'adminAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'admins',
            type: {
              vec: 'publicKey',
            },
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'verifiedPartners',
            type: {
              vec: 'publicKey',
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'EventHost',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'eventsCreated',
            type: {
              vec: 'publicKey',
            },
          },
          {
            name: 'displayName',
            type: 'string',
          },
          {
            name: 'pubKey',
            type: 'publicKey',
          },
          {
            name: 'profileImage',
            type: 'string',
          },
          {
            name: 'eventCount',
            type: 'u64',
          },
          {
            name: 'bump',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'CreateEventInput',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'title',
            type: 'string',
          },
          {
            name: 'description',
            type: 'string',
          },
          {
            name: 'uri',
            type: 'string',
          },
          {
            name: 'link',
            type: 'string',
          },
          {
            name: 'fee',
            type: 'u64',
          },
          {
            name: 'seats',
            type: 'u64',
          },
          {
            name: 'date',
            type: 'string',
          },
          {
            name: 'venue',
            type: 'string',
          },
          {
            name: 'isCutPayedByCreator',
            type: 'bool',
          },
          {
            name: 'isCustomSplToken',
            type: 'bool',
          },
          {
            name: 'customSplToken',
            type: 'publicKey',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'InvalidCustomSplToken',
      msg: 'Custom SPL Token doesnt match with Host provided token',
    },
    {
      code: 6001,
      name: 'SignerNotAdmin',
      msg: 'The Signer of this transaction is not the admin',
    },
    {
      code: 6002,
      name: 'DataNotUpdated',
      msg: 'data not updated',
    },
  ],
};
