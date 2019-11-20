import {Repo} from '../types/ChartTypes'; 

// TODO: this are just quick examples, find nicer pictures.
export const FOLDER_ICON = "https://cdn1.iconfinder.com/data/icons/modern-universal/32/icon-32-512.png";
export const FILE_ICON = "https://image.flaticon.com/icons/png/512/55/55025.png";


export const repo: Repo = {
    "name":"my-app",
    "heat":55,
    "info":[
       {
          "name":"Contributors",
          "value":"ABC"
       },
       {
          "name":"Quality score",
          "value":78
       }
    ],
    "image": FOLDER_ICON,
    "children":[
       {
          "name":"frontend",
          "heat":22,
          "image": FOLDER_ICON,
          "info":[
             {
                "name":"Contributors",
                "value":"DCE"
             },
             {
                "name":"Quality score",
                "value":44
             }
          ],
          "children":[
             {
                "name":"src",
                "heat":50,
                "info":[
                    {
                       "name":"Contributors",
                       "value":" ABC"
                    },
                    {
                       "name":"Quality score",
                       "value":78
                    }
                 ],
                "image": FOLDER_ICON,
                "children":[
                   {
                      "name":"app.ts",
                      "size":2,
                      "heat":30,
                      "image": FILE_ICON,
                      "info":[
                        {
                           "name":"Contributors",
                           "value":" ABC"
                        },
                        {
                           "name":"Quality score",
                           "value":78
                        }
                     ]
                   },
                   {
                      "name":"components",
                      "size":3,
                      "heat":150,
                      "image": FILE_ICON,
                      "info":[
                        {
                           "name":"Contributors",
                           "value":" ABC"
                        },
                        {
                           "name":"Quality score",
                           "value":78
                        }
                     ]
                   },
                   {
                      "name":"styles",
                      "size":1,
                      "heat":33,
                      "image": FILE_ICON,
                      "info":[
                        {
                           "name":"Contributors",
                           "value":" ABC"
                        },
                        {
                           "name":"Quality score",
                           "value":78
                        }
                     ]
                   },
                   {
                      "name":"tests",
                      "size":1,
                      "heat":75,
                      "image": FILE_ICON,
                      "info":[
                        {
                           "name":"Contributors",
                           "value":" ABC"
                        },
                        {
                           "name":"Quality score",
                           "value":78
                        }
                     ]
                   },
                   {
                      "name":"serviceWorker.ts",
                      "size":1,
                      "heat":34,
                      "image": FILE_ICON,
                      "info":[
                        {
                           "name":"Contributors",
                           "value":" ABC"
                        },
                        {
                           "name":"Quality score",
                           "value":78
                        }
                     ]
                   },
                   {
                      "name":"index.ts",
                      "size":1,
                      "heat":67,
                      "image": FILE_ICON,
                      "info":[
                        {
                           "name":"Contributors",
                           "value":" ABC"
                        },
                        {
                           "name":"Quality score",
                           "value":78
                        }
                     ]
                   },
                   {
                      "name":"logo.svg",
                      "size":1,
                      "heat":3,
                      "image": FILE_ICON,
                      "info":[
                        {
                           "name":"Contributors",
                           "value":" ABC"
                        },
                        {
                           "name":"Quality score",
                           "value":78
                        }
                     ]
                   }
                ]
             }
          ]
       },
       {
          "name":"A2",
          "size":1,
          "heat":35,
          "image": FILE_ICON,
          "info":[
            {
               "name":"Contributors",
               "value":" ABC"
            },
            {
               "name":"Quality score",
               "value":78
            }
         ]
       }
    ]
 }; 