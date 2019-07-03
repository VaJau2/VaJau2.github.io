using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;

namespace CheatingPractice
{
    class Program
    {
        public static List<Active> Actives = new List<Active>();

        private static string Answer(string uri)
        {
            string result;
            try
            {
                HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create(uri);
                HttpWebResponse resp = (HttpWebResponse)req.GetResponse();

                using (StreamReader stream = new StreamReader(resp.GetResponseStream(), Encoding.UTF8))
                {
                    result = stream.ReadToEnd();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("какая-то херня: " + ex);
                result = "";
            }
            return result;
        }

        static void getGeoData()
        {
            Console.Write("геокодируем");

            for (int i = 0; i < Actives.Count; i++)
            {
                if (Actives[i].Addres.Length > 0)
                {
                    string tempURL = Actives[i].Addres.Replace(' ', '+');
                    string site = "https://geocode-maps.yandex.ru/1.x/?apikey=GetYourOwnKeyPlease&geocode=" + tempURL + "&results=1";
                    string result = Answer(site);

                    if (result.Length > 0)
                    {
                        int startIndex = result.IndexOf("<pos>") + 5;
                        int endIndex = result.IndexOf("</pos>") - startIndex;
                        if (endIndex > 0)
                        {
                            string[] tempPos = new string(result.ToCharArray(), startIndex, endIndex).Split(' ');
                            Actives[i].Lat = tempPos[0];
                            Actives[i].Long = tempPos[1];
                        }
                        else
                        {
                            Actives[i].Lat = Actives[i].Long = "";
                        }
                    }
                    else
                    {
                        Actives[i].Lat = Actives[i].Long = "";
                    }
                }
                else
                {
                    Actives[i].Lat = Actives[i].Long = "";
                }
                Console.Write(".");
                Thread.Sleep(100);
            }

            Console.WriteLine();
            Console.WriteLine("готово");
            Thread.Sleep(0);

            Thread WriteGeoJSON = new Thread(writeGeoJSON);
            WriteGeoJSON.Start();
        }

        static void writeGeoJSON()
        {
            Console.Write("записываем в geojson");
            StreamWriter SW = new StreamWriter("result.geojson");
            SW.WriteLine("{ \"type\": \"FeatureCollection\",");
            SW.WriteLine(" \"features\": [");

            for(int i = 0; i < Actives.Count; i++)
            {
                SW.WriteLine("  { \"type\": \"Feature\",");
                SW.WriteLine("      \"geometry\": {\"type\": \"Point\", \"coordinates\": ["+ Actives[i].Lat + ", " + Actives[i].Long + "]},");
                SW.WriteLine("      \"properties\": {");
                SW.WriteLine("          \"Вид\": \"" + Actives[i].Type + "\",");
                SW.WriteLine("          \"Учетный номер\": \"" + Actives[i].RegNum + "\",");
                SW.WriteLine("          \"Наименование\": \"" + Actives[i].Name + "\",");
                SW.WriteLine("          \"Район\": \"" + Actives[i].Rayon + "\",");
                SW.WriteLine("          \"Населенный пункт\": \"" + Actives[i].City + "\",");
                SW.WriteLine("          \"Адрес\": \"" + Actives[i].Addres + "\",");
                SW.WriteLine("          \"Балансодержатель\": \"" + Actives[i].RegHolder + "\",");
                SW.WriteLine("          \"Реестровый номер балансодержателя\": \"" + Actives[i].RegHolderNum + "\",");
                SW.WriteLine("          \"Площадь\": \"" + Actives[i].Area + "\",");
                SW.WriteLine("          \"Этажность\": \"" + Actives[i].Floors + "\",");
                SW.WriteLine("          \"Примечание\": \"" + Actives[i].Comment + "\"");
                SW.WriteLine("          }");
                SW.WriteLine("      }");
                Console.Write(".");
                Thread.Sleep(0);
            }

            SW.WriteLine(" ]");
            SW.WriteLine("}");
            Console.WriteLine();
            Console.Write("готово с:");
        }

        static void readXML()
        {
            try
            {
                StreamReader SR = new StreamReader("mainfile.txt", Encoding.UTF8);

                Console.Write("читаем файл");
                while(SR.Peek() > -1)
                {
                    Actives.Add(new Active());
                    string[] templines = SR.ReadLine().Split('\t');
                    for(int i = 0; i < templines.Length; i++)
                    {
                        switch (i) {
                            case 0:
                                Actives.Last().Type = templines[i];
                                break;
                            case 1:
                                Actives.Last().RegNum = templines[i];
                                break;
                            case 2:
                                Actives.Last().Name = templines[i];
                                break;
                            case 3:
                                Actives.Last().Rayon = templines[i];
                                break;
                            case 4:
                                Actives.Last().City = templines[i];
                                break;
                            case 5:
                                Actives.Last().Addres = templines[i];
                                break;
                            case 6:
                                Actives.Last().RegHolder = templines[i];
                                break;
                            case 7:
                                Actives.Last().RegHolderNum = templines[i];
                                break;
                            case 8:
                                Actives.Last().Area = templines[i];
                                break;
                            case 9:
                                Actives.Last().Floors = templines[i];
                                break;
                            case 10:
                                Actives.Last().Comment = templines[i];
                                break;
                        }
                    }

                    Console.Write(".");
                   
                    Thread.Sleep(0);
                }

                Console.WriteLine();
                Console.WriteLine("готово");

                SR.Close();

                Thread GetGeoData = new Thread(getGeoData);
                GetGeoData.Start();
            }
            catch (Exception ex)
            {
                Console.WriteLine("какая-то херня: " + ex);
            }
        }

        static void Main(string[] args)
        {
            List<Active> Actives = new List<Active>();
            Console.WriteLine("Прога запущена. Ждем ответа от юзера.");
            Console.ReadKey();
            Console.WriteLine();
            
            Thread ReadXML = new Thread(readXML);
            ReadXML.Start();

            Console.ReadKey();
        }

    }

 
    public class Active
    {
        public string Type;
        public string RegNum; 
        public string Name; 
        public string Rayon; 
        public string City;
        public string Addres; 
        public string RegHolder; 
        public string RegHolderNum; 
        public string Area;
        public string Floors; 
        public string Comment;

        public string Long;
        public string Lat;

        public Active()
        {

        }

        public Active(string type, string regnum, string name, string rayon, string city, string addres, string regholder, 
            string regholdernum, string area, string floors, string comment)
        {
            Type = type;
            RegNum = regnum;
            Name = name;
            Rayon = rayon;
            City = city; 
            Addres = addres; 
            RegHolder = regholder;
            RegHolderNum = regholdernum; 
            Area = area; 
            Floors = floors;
            Comment = comment; 
    }
    }
}
