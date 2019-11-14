import {Repo} from '../types/ChartTypes'; 


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
    "children":[
       {
          "name":"frontend",
          "heat":22,
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
                "children":[
                   {
                      "name":"app.ts",
                      "size":2,
                      "heat":30,
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
                      "heat":98,
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